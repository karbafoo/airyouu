declare type ServerRes<T> = {
  success: boolean;
  data: T;
};
declare type AuthData = {
  email: string;
  password: string;
};
declare type AuthRes<T> = {
  token: string;
  profile: Profile<T>;
};
declare type Profile<T> = T & {
  name: string;
  email: string;
};
declare type Admin = {
  admin_id: string;
};
declare type User = {
  user_id: string;
};

declare type Point = {
  point_id?: string;
  status?: string;
  name: string;
  position: LatLng;
};
declare type LatLng = { lat: number; lng: number };

declare type Package = {
  status?: string;
  package_id?: string;
  user: Profile<User>;
  items: Item[];
  points: Point[];
};
declare type Item = {
  name: string;
  quantity: number;
  description: string;
  volume: number;
  weight: number;
};
