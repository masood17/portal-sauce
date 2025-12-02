import Profile from "../../../models/Profile";

/**
 * Common
 */
export type Document =
  | FacilityDocument
  | ProductDocument
  | IngredientDocument
  | ManufacturerDocument;
export type Documents =
  | FacilityDocument[]
  | ProductDocument[]
  | IngredientDocument[]
  | ManufacturerDocument[];

export enum DocumentStatus {
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

/**
 * Client types
 */
export interface User {
  id: number | null;
  role: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Client types
 */
export interface Client {
  id: number | null;
  user_id: number | null;
  reviewer_id: number | null;
  facility_count?: number | null;
  product_count?: number | null;
  report_count?: number | null;
  approved_report_count?: number | null;
  business_name: string;
  website: string;
  description: string;
  risk_type: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "CERTIFIED" | "SUSPENDED" | "DECOMMISSIONED";
  updated_at: string;
  created_at: string;
  // status: ClientStatus;
  // check_expired_certs: boolean;
  // check_new_certs: boolean;
  user?: any;
  reviewer?: any;
  facilities?: Facility[];
  products?: Product[];
  qrcode?: string;
}

export enum ClientStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  NOT_APPLICABLE = "NOT APPLICABLE",
}

export interface HED {
  name: string;
  phone_number: string;
  email: string;
}

export interface ClientDashboardStats {
  account_status: Client["status"];
  cr_id: number;
  cr_type: string;
  cr_status: string;
  cr_submission_progress: number;
  cr_review_progress: number;
  cr_doc_report: boolean;
  cr_audit_report: boolean;
  cr_certificate: boolean;
  facility_count: number;
  product_count: number;
  has_hed: boolean;
  review_request_count: number;
  has_expired_certs: boolean;
  has_new_certs: boolean;
  has_failed_submissions: boolean;
}

export interface Hed extends Profile {
  hed_id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

/**
 * Review types
 */
export interface ReviewRequest {
  id: number | null;
  client_id: number | null;
  reviewer_id: number | null;
  hed_id: number | null;
  facility_id: number | null;
  is_locked: boolean;
  assured_space_check: boolean;
  client_email?: string;
  business_name: string;
  reviewer?: any;
  hed?: any;
  reviewer_email?: string;
  type: string;
  status: string;
  type_color: string;
  status_color: string;
  current_step_index: number;
  created_at: string;
  updated_at: string;
}

export enum ReviewRequestStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  IN_REVIEW = "IN REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Review {
  id: number | null;
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  date: number;
  reviewDate: number;
  reviewerName: string;
  status: ReviewStatus;
}

export enum ReviewStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  NOT_APPLICABLE = "NOT APPLICABLE",
}

/**
 * Certificate types
 */
export interface Certificate extends File {
  id: number | null;
  client_id: number | null;
  request_id: number | null;
  path: string;
  tags?: any;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export type CertificateDocument = Certificate;

/**
 * Report types
 */
export interface Report extends File {
  id: number | null;
  client_id: number | null;
  request_id: number | null;
  type: string;
  status: string;
  path: string;
  tags?: any;
  created_at: string;
  updated_at: string;
}

export enum ReportStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type ReportDocument = Report;

/**
 * Facility Category types
 */
export interface Facility {
  id: number | null;
  qualified_id?: string;
  review_request_id: number | null;
  category_id: number | null;
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  updated_at: string;
  created_at: string;
}

export interface FacilityDocument extends File {
  id: number | null;
  facility_id: number | null;
  type: string; // enum
  status: string; // enum
  note: string;
  path: string;
  expires_at: string;
  updated_at: string;
  created_at: string;
}

export enum FacilityDocumentType {
  PEST_CONTROL = "PEST_CONTROL",
  INSPECTION_SHEET = "INSPECTION_SHEET",
  HIP = "HIP",
  SSOP = "SSOP",
  WATER_REPORT = "WATER_REPORT",
  RECALL_PLAN = "RECALL_PLAN",
  // new
  LEGAL_BUSINESS_DOCUMENTS = "LEGAL_BUSINESS_DOCUMENTS",
  TRACEABILITY_PLAN = "TRACEABILITY_PLAN",
  FLOWCHART_OF_PROCESSING = "FLOWCHART_OF_PROCESSING",
}

export interface FacilityCategory {
  id: number | null;
  title: string;
  code: string;
}

/**
 * Product types
 */
export interface Product {
  id: number | null;
  qualified_id?: string;
  review_request_id: number | null;
  facility_id: number | null;
  category_id: number | null;
  name: string;
  description?: string;
  preview_image: string;
  ingredients: Ingredient[];
  documents?: ProductDocument[];
  date: number;
  updated_at?: string;
  created_at?: string;
  // front end only
  open?: boolean;
}

export interface ProductDocument extends File {
  id: number | null;
  product_id: number | null;
  type: string; // enum
  status: string; // enum
  note: string;
  path: string;
  expires_at: string;
  updated_at: string;
  created_at: string;
}

export enum ProductDocumentType {
  SPEC_SHEETS = "SPEC_SHEETS",
  CERTIFICATE_OF_ANALYSIS = "CERTIFICATE_OF_ANALYSIS",
  TESTING = "TESTING",
}

export interface ProductCategory {
  id: number | null;
  title: string;
  code: string;
}

/**
 * Ingredient types
 */
export interface Ingredient {
  id: number | null;
  ids?: number[];
  review_request_id: number | null;
  client_id: number | null;
  product_id: number | null;
  name: string;
  manufacturer: Manufacturer | null;
  manufacturer_name?: string;
  manufacturer_docs?: ManufacturerDocument[];
  description: string;
  recommendation: string;
  source: string;
}

export enum IngredientRecommendation {
  HALAL_ASLAN = "Halal Aslan",
  MASHBUH = "Mashbuh",
  HARAM = "Haram",
}

export enum IngredientSource {
  ANIMAL = "Animal",
  PLANT = "Plant",
  SYNTHETIC = "Synthetic",
  MINERAL = "Mineral",
  GAS = "Gas",
}

export interface IngredientDocument extends File {
  id: number | null;
  ingredient_id: number | null;
  type: string; // enum
  status: string; // enum
  note: string;
  path: string;
  expires_at: string;
  updated_at: string;
  created_at: string;
}

export enum IngredientDocumentType {
  CERTIFICATE_OR_DISCLOSURE = "CERTIFICATE_OR_DISCLOSURE",
}

export interface IngredientDocument extends File {
  id: number | null;
  ingredient_id: number | null;
  type: string; // enum
  path: string;
  expires_at: string;
  updated_at: string;
  created_at: string;
}


export interface TrashedData {
  id: number | null;
  data_type: "FACILITY" | "PRODUCT" | "INGREDIENT";
  name: string;
  business_name: string;
  created_at: string;
  deleted_at: string;
}

/**
 * Manufacturer types
 */
export interface Manufacturer {
  id?: number;
  name: string;
  email?: string;
  documents?: ManufacturerDocument[];
  created_at?: string;
  updated_at?: string;
}

export interface ManufacturerDocument extends File {
  id: number | null;
  manufacturer_id: number | null;
  type: string; // enum
  status: string; // enum
  note: string;
  path: string;
  expires_at: string;
  updated_at: string;
  created_at: string;
}

export enum ManufacturerDocumentType {
  CERTIFICATE_OR_DISCLOSURE = "CERTIFICATE_OR_DISCLOSURE",
}

/**
 * Certificate types
 */
export enum CertificateStatus {
  ISSUED,
  PENDING,
  SUSPENDED,
}
