export type IIdentity = {
  id: number;
  name: string;
  avatar: string;
  email: string;
  role: string;
};

export type File = {
  name: string;
  percent: number;
  size: number;
  status: 'error' | 'success' | 'done' | 'uploading' | 'removed';
  type: string;
  uid: string;
  url: string;
};

export type Category = {
  id: number;
  title: string;
  isActive: boolean;
  cover?: string;
};

export type Product = {
  id: number;
  name: string;
  isActive: boolean;
  description: string;
  images: File[];
  createdAt: string;
  price: number;
  category: Category;
  stock: number;
};

export type Address = {
  text: string;
  coordinate: [string, string];
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  gsm: string;
  createdAt: string;
  isActive: boolean;
  avatar: File[];
  addresses: Address[];
};

export type OrderStatus = {
  id: number;
  text: 'Pending' | 'Ready' | 'On The Way' | 'Delivered' | 'Cancelled';
};

export type Store = {
  id: number;
  title: string;
  isActive: boolean;
  createdAt: string;
  address: Address;
  products: Product[];
};

export type Courier = {
  id: number;
  name: string;
  surname: string;
  gender: string;
  gsm: string;
  createdAt: string;
  isActive: boolean;
  avatar: File[];
};

export type Event = {
  date: string;
  status: string;
};

export type Order = {
  id: number;
  retailer_id: number;
  retailer_name: string;
  plant_id: number;
  plant_name: string;
  plan_id: number | null;
  plan_name: string | null;
  packaging_type_id: number;
  packaging_type_name: string;
  deposit_price: number;
  total_price: number | null;
  status: string;
  address: string;
  phone: string;
  preorder_quantity: number;
  estimate_pick_up_date: string;
  created_at: string;
  transactions: Array<{
    id: number;
    content: string;
    price: number;
    type: string;
    status: string;
  }>;
  products: Array<any>;
};

export type BasketOrder = {
  productId: number;
  amount: number;
};

export type Plant = {
  id: number;
  plant_name: string;
  quantity: number;
  description: string;
  base_price: number;
  type: string;
  image_url: string;
  delta_one: number;
  delta_two: number;
  delta_three: number;
  preservation_day: number;
  estimated_per_one: number;
  status: string;
};

export type IPlan = {
  id: number;
  plant_id: number;
  plant_name: string;
  yield_id: number;
  yield_name: string;
  expert_id: number;
  expert_name: string;
  plan_name: string;
  description: string;
  contract_address: string;
  start_date: string;
  end_date: string;
  complete_date?: string;
  status: 'Draft' | 'Pending' | 'Ongoing' | 'Completed' | 'Cancelled';
  estimated_product: number;
  estimated_unit: string;
  qr_code: string;
  seed_quantity: number;
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
  plant_information?: {
    plant_id: number;
  };
  yield_information?: {
    yield_id: number;
  };
  is_approved: boolean;
};
