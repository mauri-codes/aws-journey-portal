import { EC2InstanceExpectations, EC2InstanceIdentifier, InstanceConstructorParameters } from "../../types/EC2/Instance"
import { InstanceNotFound, MultipleNamedInstancesFound } from "../../errors/EC2/Instance"
import { DescribeInstancesCommand, Instance } from "@aws-sdk/client-ec2"
import { ResourceLoadedSuccessfully, TestError } from "../../errors"
import { TestResult } from "../../types/tests"
import { CatchTestError } from "../../tests"
import { EC2Resource } from "."

export class EC2Instance extends EC2Resource {
    resourceName: string = EC2Instance.name
    instanceData: Instance | undefined
    identifier: EC2InstanceIdentifier
    instanceExpectations: EC2InstanceExpectations
    instanceSummary: string
    constructor({environment, instanceExpectations, instanceIdentifier}: InstanceConstructorParameters) {
        super(environment)
        this.instanceExpectations = instanceExpectations
        this.identifier = instanceIdentifier
        this.instanceSummary = this.getIdentifierSummary().toString()
    }
    getFilters() {
        let vpcId, name, tags
        let filters = []
        let {instanceId, search} = this.identifier
        if (search){
            ;({ vpcId, name, tags } = search)
        }
        if (instanceId) {
            filters.push(this.getSimpleFilter("instance-id", [instanceId]))
        } else {
            if (vpcId) {
                filters.push(this.getSimpleFilter("vpc-id", [vpcId]))
            }
            if (name) {
                filters.push(this.getSimpleFilter("tag:Name", [name]))   
            }
            if (tags) {
                tags.forEach((tag) => {
                    filters.push(this.getSimpleFilter(`tag:${tag.Name}`, [tag.Value]))
                })
            }
        }
        return filters
    }
    getIdentifierSummary () {
        let vpcId, name, tags
        let { instanceId, search } = this.identifier
        if (search) {
            ;({ vpcId, name, tags } = search)
        }
        let summary = [ instanceId, vpcId, name, tags ]
        return summary.filter(element => element != null)
    }
    async describeInstance() {
        let Filters = this.getFilters()
        
        const {Reservations} = await this.client.send(
            new DescribeInstancesCommand({Filters})
        )
        if (Reservations === undefined || Reservations.length === 0)
            throw new TestError(InstanceNotFound(this.instanceSummary))
        if (Reservations.length > 1)
            throw new TestError(MultipleNamedInstancesFound(this.instanceSummary))
        const {Instances} = Reservations[0]
        if (Instances === undefined || Instances.length === 0)
            throw new TestError(InstanceNotFound(this.instanceSummary))
        if (Instances.length > 1)
            throw new TestError(MultipleNamedInstancesFound(this.instanceSummary))
        this.instanceData = Instances[0]
        
        return ResourceLoadedSuccessfully(this.getIdentifierSummary().toString(), this.resourceName)
    }
    @CatchTestError()
    async loadResource(): Promise<TestResult> {
        let response = await this.describeInstance()
        if (this.instanceExpectations.Role) {
            response.tests = this.flattenTestResults([await this.instanceExpectations.Role.load()])
        }
        return response
    }
}
