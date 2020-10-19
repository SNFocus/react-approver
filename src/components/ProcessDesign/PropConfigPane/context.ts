import React from "react";
const obj: any = {
  title: "条件",
  formPermissions: [],
  initiator: null,
  approvers: [],
  assigneeType: "user",
  counterSign: false,
  optionalRange: "ALL",
  optionalMulti: true,
  menbers: [],
  optional: false,
  conditions: [],
  isDefault: false,
  priority: 0,
};
export const ConfigCtx = React.createContext(obj);
