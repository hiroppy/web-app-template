import type { User } from "next-auth";

export const user1: User = <const>{
  id: "id1",
  name: "user1",
  email: "user1@a.com",
  image:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAMElEQVR42u3OMQEAAAQAMDrpp4Zuyojh2RIsa7bjUQoICAgICAgICAgICAgICHwHDhv0ROEuXMGUAAAAAElFTkSuQmCC",
  role: "user",
};

export const admin1: User = <const>{
  id: "id2",
  name: "admin1",
  email: "admin1@a.com",
  image:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8qS5UDwAExgGj/3sspQAAAABJRU5ErkJggg==",
  role: "admin",
};
