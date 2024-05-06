# CorpWeb CDK TypeScript Project

## Overview

This project leverages AWS CDK (Cloud Development Kit) to programmatically provision and manage the necessary infrastructure for a highly available web application on AWS. The infrastructure setup includes a VPC, multiple subnets across different Availability Zones, EC2 instances, an Application Load Balancer (ALB), and security configurations.

## Architecture

- **VPC**: `EngineeringVpc` with a CIDR of `10.0.0.0/18`, configured to enable DNS support and hostnames.
- **Subnets**: Two public subnets (`PublicSubnet1` and `PublicSubnet2`) located in different Availability Zones to ensure high availability and fault tolerance.
- **EC2 Instances**: Two EC2 instances (`WebServer1` and `WebServer2`) running Amazon Linux 2, set up with web server configurations to serve web content.
- **Application Load Balancer (ALB)**: `CorpWebALB` which distributes incoming HTTP traffic evenly across the two web server instances.
- **Security Groups**: `WebserversSG` designed to allow SSH access from a specified IP address and HTTP access from the internet.

## Prerequisites

- **AWS Account**: Ensure you have an AWS account with appropriate permissions to create the resources described.
- **AWS CLI**: Installed and configured for command line access and operations.
- **Node.js and NPM**: Ensure Node.js and npm are installed to work with AWS CDK.
- **AWS CDK Toolkit**: Install the AWS CDK Toolkit globally using npm: `npm install -g aws-cdk`.

## Setup and Deployment

1. **Clone the Repository**:
   Clone this repository to your local machine to get started with the CDK project.

   ```bash
   git clone https://github.com/gagandua078/AWS-CDK-App.git
   cd corpweb-cdk-project
   ```

2. **Install Dependencies**:
   Navigate to the project directory and install the required npm packages.

   ```bash
   npm install
   ```

3. **Compile TypeScript to JavaScript**:
   Before deployment, compile the TypeScript files to JavaScript.

   ```bash
   npm run build
   ```

4. **Deploy the CDK Stack**:
   Deploy your stack to the default AWS account and region configured in your AWS CLI.

   ```bash
   npx cdk deploy
   ```

   This command will synthesize the CloudFormation template from your CDK scripts and deploy it, creating the infrastructure described above.

## Clean Up

To avoid incurring unnecessary charges, remember to delete the resources when they are no longer needed:

```bash
npx cdk destroy
```

--

## License

The code within this project is dual-licensed under the GLINCKER LLC proprietary license and the MIT License. This means it is open for reference and educational purposes, allowing for use, modification, and distribution in accordance with the MIT License's terms, while also respecting the proprietary rights and restrictions under the GLINCKER LLC license.

## MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
