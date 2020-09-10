import {jsonCopy} from '../../utils/index'

export enum NODE_TYPE {
    APPROVER = 'approver',
    START = 'start',
    CONDITION = 'condition',
    ROUTE = 'route',
    CARBON_COPY = 'carboncopy'
}

type TYPE_APPROVER = NODE_TYPE.APPROVER
type TYPE_START = NODE_TYPE.START
type TYPE_CONDITION = NODE_TYPE.CONDITION
type TYPE_ROUTE = NODE_TYPE.ROUTE
type TYPE_CARBON_COPY = NODE_TYPE.CARBON_COPY

export interface FormPermission {
    formId: number;
    permission: number;
}

export interface Condition {
    conditionValue: any;
    formId: number; 
}

export interface Organization {
    id: number;
    name: string;
    type: string;
    belong: number | null;
}

export interface CCProperty {
    menbers: Organization[],
    title: string;
    optional: boolean;
}

export interface ConditionProperty {
    conditions: Condition[];
    initiator: Organization | Organization[] | null;
    isDefault: boolean;
    priority: number;
    title: string;
}

export interface ApproverProperty {
    title: string;
    approvers: Organization[];
    counterSign: boolean;
    optionalRange: string;
    optionalMulti: boolean;
    formPermissions: FormPermission[];
}

export type ChildNode = RouteNode | ApproverNode | CarbonCopyNode ;
export type CardNode = ApproverNode | ConditionNode | CarbonCopyNode | StartNode;
export type ProcessNode = ApproverNode | ConditionNode | CarbonCopyNode | StartNode | RouteNode

export interface StartProperty {
    title: string;
    formPermissions: FormPermission[];
    initiator: Organization | Organization[] | null;
}

export interface RouteNode {
    type: TYPE_ROUTE;
    nodeId: string;
    prevId: string;
    conditionNodes: ConditionNode[];
}

export interface StartNode {
    type: TYPE_START;
    nodeId: string;
    content: string;
    childNode ?: ChildNode;
    properties: StartProperty;
}

export interface ApproverNode {
    type: TYPE_APPROVER;
    nodeId: string;
    prevId: string;
    content: string;
    properties: ApproverProperty;
    childNode ?: ChildNode;
}

export interface ConditionNode {
    type: TYPE_CONDITION;
    nodeId: string;
    prevId: string;
    content: string;
    properties: ConditionProperty;
    childNode ?: ChildNode;
}

export interface CarbonCopyNode {
    type: TYPE_CARBON_COPY;
    nodeId: string;
    prevId: string;
    content: string;
    properties: CCProperty;
    childNode ?: ChildNode;
}

const CARBON_COPY_TEMP: CarbonCopyNode = {
    type: NODE_TYPE.CARBON_COPY,
    nodeId: 's4',
    prevId: 's1',
    content: '请选择抄送人',
    properties: {
        menbers: [],
        title: '抄送人',
        optional: false
    },
}

const APPROVER_NODE_TEMP: ApproverNode = {
    type: NODE_TYPE.APPROVER,
    nodeId: 's2',
    prevId: 's1',
    content: '请选择审批人',
    properties: {
        title: '审批人',
        approvers: [],
        counterSign: false,
        optionalRange: 'ALL',
        optionalMulti: true,
        formPermissions: [],
    },
}


const CONDITION_NODE_TEMP: ConditionNode = {
    type: NODE_TYPE.CONDITION,
    nodeId: 's3',
    prevId: 's2',
    content: '请添加条件',
    properties: {
        conditions: [],
        initiator: null,
        isDefault: false,
        priority: 0,
        title: '条件',
    },
}

const ROUTE_NODE_TEMP: RouteNode = {
    type: NODE_TYPE.ROUTE,
    nodeId: 's6',
    prevId: 's1',
    conditionNodes: [jsonCopy(CONDITION_NODE_TEMP), jsonCopy(CONDITION_NODE_TEMP)].map((t, i) => {
        t.nodeId = 'c' + i
        t.properties.title = '条件' + i
        t.properties.priority = i
        return t
    })
}

const MockData: StartNode = {
    type: NODE_TYPE.START,
    nodeId: 's1',
    content: '所有人',
    properties: {
        title: '发起人',
        formPermissions: [],
        initiator: null
    },
    childNode: jsonCopy(ROUTE_NODE_TEMP),
}

export function isCardNode (n: ProcessNode): n is CardNode  {
    return n.type !== NODE_TYPE.ROUTE
}

export const Cards = [MockData, APPROVER_NODE_TEMP, CONDITION_NODE_TEMP, CARBON_COPY_TEMP, ROUTE_NODE_TEMP]
export default MockData;