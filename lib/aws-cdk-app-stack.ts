import { Stack, StackProps, CfnParameter, App, CfnOutput } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export class AwsCdkAppStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Parameters
    const instanceType = new CfnParameter(this, 'InstanceType', {
      type: 'String',
      allowedValues: ['t2.micro', 't2.small'],
      default: 't2.micro',
      description: 'The EC2 instance type for the web servers',
    });

    const keyPair = new CfnParameter(this, 'KeyPair', {
      type: 'AWS::EC2::KeyPair::KeyName',
      description:
        'The name of the key pair to use for SSH access to the EC2 instances',
    });

    const yourIp = new CfnParameter(this, 'YourIp', {
      type: 'String',
      allowedPattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$',
      description:
        'Your public IP address in CIDR notation for secure SSH access',
    });

    // VPC
    const vpc = new ec2.Vpc(this, 'EngineeringVpc', {
      cidr: '10.0.0.0/18',
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // Internet Gateway and Attachments
    const igw = new ec2.CfnInternetGateway(this, 'InternetGateway', {
      tags: [{ key: 'Name', value: 'EngineeringIGW' }],
    });

    new ec2.CfnVPCGatewayAttachment(this, 'AttachGateway', {
      vpcId: vpc.vpcId,
      internetGatewayId: igw.ref,
    });

    // Route Table, Routes, and Subnet Associations
    const routeTable = new ec2.CfnRouteTable(this, 'RouteTable', {
      vpcId: vpc.vpcId,
      tags: [{ key: 'Name', value: 'PublicRouteTable' }],
    });

    new ec2.CfnRoute(this, 'PublicRoute', {
      routeTableId: routeTable.ref,
      destinationCidrBlock: '0.0.0.0/0',
      gatewayId: igw.ref,
    });

    vpc.publicSubnets.forEach((subnet, index) => {
      new ec2.CfnSubnetRouteTableAssociation(
        this,
        `SubnetRouteTableAssociation${index}`,
        {
          subnetId: subnet.subnetId,
          routeTableId: routeTable.ref,
        }
      );
    });

    // Security Group
    const securityGroup = new ec2.SecurityGroup(this, 'WebserversSG', {
      vpc,
      description: 'Security group for web servers allowing ports 22 and 80',
    });

    securityGroup.addIngressRule(
      ec2.Peer.ipv4(yourIp.valueAsString),
      ec2.Port.tcp(22),
      'SSH Access'
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'HTTP Access'
    );

    // EC2 Instances
    const amiId = 'ami-01cc34ab2709337aa';
    [1, 2].forEach((num) => {
      new ec2.Instance(this, `WebServer${num}`, {
        vpc,
        instanceType: new ec2.InstanceType(instanceType.valueAsString),
        machineImage: ec2.MachineImage.genericLinux({ 'us-east-1': amiId }),
        keyName: keyPair.valueAsString,
        vpcSubnets: { subnets: vpc.publicSubnets },
        securityGroup,
        userData: ec2.UserData.custom(`#!/bin/bash
yum update -y
yum install -y httpd php git
systemctl start httpd
systemctl enable httpd
aws s3 cp s3://mycorp-webapp-resources/index.html /var/www/html/index.html
`),
      });
    });

    // Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(
      this,
      'ApplicationLoadBalancer',
      {
        vpc,
        internetFacing: true,
        securityGroup,
      }
    );

    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'TargetGroup', {
      vpc,
      protocol: elbv2.ApplicationProtocol.HTTP,
      port: 80,
      targetType: elbv2.TargetType.INSTANCE,
    });

    alb.addListener('Listener', {
      port: 80,
      defaultTargetGroups: [targetGroup],
    });

    // Outputs
    new CfnOutput(this, 'WebUrl', {
      description: 'The URL of the corporate web application.',
      value: alb.loadBalancerDnsName,
    });
  }
}
