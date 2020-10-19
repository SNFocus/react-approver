
  
type TYPE_APPROVER = "approver";
type TYPE_START = "start";
type TYPE_CONDITION = "condition";
type TYPE_ROUTE = "route";
type TYPE_CARBON_COPY = "carboncopy";
  
interface FormPermission {
    formId: number;
    permission: number;
}
  
interface Condition {
    conditionValue: any;
    formId: number;
}
  
interface Organization {
    id: number;
    name: string;
    type: string;
    pid: number | null;
}
  
interface CCProperty {
    menbers: Organization[];
    title: string;
    optional: boolean;
  }
  
interface ConditionProperty {
    conditions: Condition[];
    initiator: Organization | Organization[] | null;
    isDefault: boolean;
    priority: number;
    title: string;
  }
  
interface ApproverProperty {
    title: string;
    approvers: Organization[];
    assigneeType: string;
    counterSign: boolean;
    optionalRange: string;
    optionalMulti: boolean;
    formPermissions: FormPermission[];
  }
  
type CardProperty = StartProperty | ApproverProperty | CCProperty | ConditionProperty
  
type ProChildNode = RouteNode | ApproverNode | CarbonCopyNode;
type CardNode =
    | ApproverNode
    | ConditionNode
    | CarbonCopyNode
    | StartNode;
type ProcessNode =
    | ApproverNode
    | ConditionNode
    | CarbonCopyNode
    | StartNode
    | RouteNode;
  
interface StartProperty {
    title: string;
    formPermissions: FormPermission[];
    initiator: Organization | Organization[] | null;
  }
  
interface RouteNode {
    type: TYPE_ROUTE;
    nodeId: string;
    prevId: string;
    conditionNodes: ConditionNode[];
    childNode?: ProChildNode;
  }
  
interface StartNode {
    type: TYPE_START;
    nodeId: string;
    content: string;
    properties: StartProperty;
    childNode?: ProChildNode;
  }
  
interface ApproverNode {
    type: TYPE_APPROVER;
    nodeId: string;
    prevId: string;
    content: string;
    properties: ApproverProperty;
    childNode?: ProChildNode;
  }
  
interface ConditionNode {
    type: TYPE_CONDITION;
    nodeId: string;
    prevId: string;
    content: string;
    properties: ConditionProperty;
    childNode?: ProChildNode;
}
  
interface CarbonCopyNode {
    type: TYPE_CARBON_COPY;
    nodeId: string;
    prevId: string;
    content: string;
    properties: CCProperty;
    childNode?: ProChildNode;
  }