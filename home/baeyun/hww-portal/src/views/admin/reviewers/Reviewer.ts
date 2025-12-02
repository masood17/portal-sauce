export interface Reviewer {
  id: null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cell: string;
  address: {
    country: string;
    state: string;
    city: string;
    street: string;
    zip: string;
  };
  avatarUrl: string;
  password: string;
  confirmPassword: string;
}

export const reviewerDefaults: Reviewer = {
  id: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  cell: "",
  address: {
    country: "",
    state: "",
    city: "",
    street: "",
    zip: "",
  },
  avatarUrl: "",
  password: "12345678",
  confirmPassword: "12345678",
};
