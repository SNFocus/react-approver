import { NODE_TYPE } from "../constant/enum";

export const CARBON_COPY_TEMP: CarbonCopyNode = {
  type: NODE_TYPE.CARBON_COPY,
  nodeId: "s4",
  prevId: "s1",
  content: "请选择抄送人",
  properties: {
    menbers: [],
    title: "抄送人",
    optional: false,
  },
};

export const APPROVER_NODE_TEMP: ApproverNode = {
  type: NODE_TYPE.APPROVER,
  nodeId: "s2",
  prevId: "s1",
  content: "请选择审批人",
  properties: {
    title: "审批人",
    approvers: [],
    assigneeType: 'user',
    counterSign: false,
    optionalRange: "ALL",
    optionalMulti: true,
    formPermissions: [],
  },
};

export const CONDITION_NODE_TEMP: ConditionNode = {
  type: NODE_TYPE.CONDITION,
  nodeId: "s3",
  prevId: "s2",
  content: "请添加条件",
  properties: {
    conditions: [],
    initiator: null,
    isDefault: false,
    priority: 0,
    title: "条件",
  },
};

export const ROUTE_NODE_TEMP: RouteNode = {
  type: NODE_TYPE.ROUTE,
  nodeId: "s6",
  prevId: "s1",
  conditionNodes: [ ],
};

export const START_NODE_TEMP: StartNode = {
  type: NODE_TYPE.START,
  nodeId: "s1",
  content: "所有人",
  properties: {
    title: "发起人",
    formPermissions: [],
    initiator: null,
  },
}

export const TEMP_MAP = {
  [NODE_TYPE.START]: START_NODE_TEMP,
  [NODE_TYPE.APPROVER]: APPROVER_NODE_TEMP,
  [NODE_TYPE.CARBON_COPY]: CARBON_COPY_TEMP,
  [NODE_TYPE.ROUTE]: ROUTE_NODE_TEMP,
  [NODE_TYPE.CONDITION]: CONDITION_NODE_TEMP
}

  const a = Object.assign({}, START_NODE_TEMP.properties, APPROVER_NODE_TEMP.properties, CARBON_COPY_TEMP.properties, CONDITION_NODE_TEMP.properties)
  console.log(a)
const RouteMock: RouteNode = {
  type: NODE_TYPE.ROUTE,
  nodeId: "s2",
  prevId: "s1",
  conditionNodes: [
    {
      type: NODE_TYPE.CONDITION,
      nodeId: "c20",
      prevId: "s2",
      content: "请添加条件",
      properties: {
        conditions: [],
        initiator: null,
        isDefault: false,
        priority: 0,
        title: "条件0",
      },
      childNode: {
        type: "approver",
        nodeId: "c200",
        prevId: "c20",
        content: "请选择审批人",
        properties: {
          title: "审批人",
          approvers: [],
          assigneeType: 'user',
          counterSign: false,
          optionalRange: "ALL",
          optionalMulti: true,
          formPermissions: [],
        },
      },
    },
    {
      type: NODE_TYPE.CONDITION,
      nodeId: "c21",
      prevId: "s2",
      content: "请添加条件",
      properties: {
        conditions: [],
        initiator: null,
        isDefault: false,
        priority: 1,
        title: "条件1",
      },
      childNode: {
        type: NODE_TYPE.APPROVER,
        nodeId: "c211",
        prevId: "c21",
        content: "请选择审批人",
        properties: {
          title: "审批人",
          approvers: [],
          assigneeType: 'user',
          counterSign: false,
          optionalRange: "ALL",
          optionalMulti: true,
          formPermissions: [],
        },
      },
    },
  ],
  childNode: {
    type: NODE_TYPE.CARBON_COPY,
    nodeId: "s4",
    prevId: "s2",
    content: "请选择抄送人",
    properties: {
      menbers: [],
      title: "抄送人",
      optional: false,
    },
  },
}

const MockData: StartNode = {
  type: NODE_TYPE.START,
  nodeId: "s1",
  content: "所有人",
  properties: {
    title: "发起人",
    formPermissions: [],
    initiator: null,
  },
  childNode: RouteMock
};

export function isCardNode(n: ProcessNode): n is CardNode {
  return n.type !== NODE_TYPE.ROUTE;
}

export default MockData;
