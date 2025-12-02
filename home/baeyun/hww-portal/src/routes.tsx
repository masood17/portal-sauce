import React from "react";
import { Navigate } from "react-router-dom";

import Auth from "./api/Auth";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import ReviewerDashboardLayout from "./layouts/ReviewerDashboardLayout";
import ClientDashboardLayout from "./layouts/ClientDashboardLayout";

// Common screens
import LoginView from "./views/common/auth/LoginView";
import ForgotPasswordView from "./views/common/auth/ForgotPasswordView";
import ResetPasswordView from "./views/common/auth/ResetPasswordView";
import RegisterView from "./views/common/auth/RegisterView";
import ChangePasswordView from "./views/common/auth/profile/ChangePasswordView";
import VerifyCertificateView from "./views/common/verify";
import NotFoundView from "./views/common/errors/NotFoundView";

// Admin screens
import AdminDashboardView from "./views/admin/dashboard";
import AdminClientsView from "./views/admin/clients";
import AdminClientView from "./views/admin/clients/client";
import AdminClientRequestsView from "./views/admin/requests";
import AdminClientSingleRequestsView from "./views/admin/requests/request";
import AdminReviewsView from "./views/admin/reviews";
import AdminReviewerListView from "./views/admin/reviewers";
import AdminFacilityCategoriesView from "./views/admin/facility-categories";
import AdminAuditorView from "./views/admin/auditor";
import AdminProductCategoriesView from "./views/admin/product-categories";
// import AdminDashboardView from "./views/admin/reports/DashboardView";
import AdminProfile from "./views/admin/profile/index";
import AdminProfileEdit from "./views/admin/profile/edit/index";

// Reviewer screens
import ReviewerClientRequestsView from "./views/reviewer/requests";
import ReviewerClientRequestReviewView from "./views/reviewer/requests/review";
import ReviewerClientRequestReportsView from "./views/reviewer/requests/reports";
import ReviewerClientsView from "./views/reviewer/clients";
import ReviewerRegisterClientView from "./views/reviewer/clients/register";
import ReviewerClientView from "./views/reviewer/clients/client";
import ReviewerManufacturersView from "./views/reviewer/manufacturers";
import ReviewerSingleManufacturerView from "./views/reviewer/manufacturers/manufacturer";
import ReviewerReviewsQueueView from "./views/reviewer/reviews-queue";
import ReviewerApprovedReviewsView from "./views/reviewer/approved-reviews";
import ReviewerDraftedReviewsView from "./views/reviewer/drafted-reviews";
import ReviewerNewReviewView from "./views/reviewer/new-review";
import ReviewerAuditorView from "./views/reviewer/auditor";
import ReviewerProfile from "./views/reviewer/profile/index";

// Client screens
import ClientDashboardView from "./views/client/dashboard/DashboardView";
import ClientRequestsView from "./views/client/requests";
import ClientDocumentsView from "./views/client/documents";
import ClientHelpView from "./views/client/help";
import ClientFacilitiesView from "./views/client/facilities";
import ClientProductsView from "./views/client/products";
import ClientHedsView from "./views/client/heds";
import ClientRequestView from "./views/client/requests/request";
import ClientRequestCorrectionsView from "./views/client/requests/request/Corrections";
import ClientRequestCertifcatesView from "./views/client/requests/request/RequestCertificates";
import ClientReportsView from "./views/client/reports";
import ClientAuditReportsView from "./views/client/reports/audit";
import ClientReviewReportsView from "./views/client/reports/review";
import ClientCertificatesView from "./views/client/certificates";
import ClientProfile from "./views/client/profile/index";
import ClientProfileEdit from "./views/client/profile/edit/index";

// Misc
import TrashView from "./views/common/trash"; // TODO make common

const REFERRER = document.location;

// PartialRouteObject
const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "login", element: <LoginView /> },
      { path: "forgot-password", element: <ForgotPasswordView /> },
      { path: "password/reset", element: <ResetPasswordView /> },
      { path: "register", element: <RegisterView /> },
      { path: "verify/:id", element: <VerifyCertificateView /> },
      { path: "404", element: <NotFoundView /> },
      { path: "/", element: <LoginView /> }, // <Navigate to="/login" />
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
  // ADMIN routes
  {
    path: "/admin",
    element: <PrivateRoute component={AdminDashboardLayout} />,
    children: [
      { path: "dashboard", element: <AdminDashboardView /> },
      { path: "review-requests", element: <AdminClientRequestsView /> },
      { path: "clients", element: <AdminClientsView /> },
      { path: "client/:id", element: <AdminClientView /> },
      {
        path: "clients/request/:id",
        element: <AdminClientSingleRequestsView />,
      },
      // { path: "account", element: <AdminAccountView /> }, // @TODO remove
      { path: "reviews", element: <AdminReviewsView /> },
      { path: "reviewers", element: <AdminReviewerListView /> },
      { path: "facility-categories", element: <AdminFacilityCategoriesView /> },
      { path: "product-categories", element: <AdminProductCategoriesView /> },
      { path: "auditor", element: <AdminAuditorView /> },
      // { path: "dashboard", element: <AdminDashboardView /> },
      // { path: "products", element: <ProductListView /> },
      // { path: "settings", element: <SettingsView /> },
      { path: "profile", element: <AdminProfile /> },
      { path: "profile/edit", element: <AdminProfileEdit /> },
      { path: "change-password", element: <ChangePasswordView /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
  // REVIEWER routes
  {
    path: "/reviewer",
    element: <PrivateRoute component={ReviewerDashboardLayout} />,
    children: [
      { path: "clients", element: <ReviewerClientsView /> },
      { path: "clients/register", element: <ReviewerRegisterClientView /> },
      { path: "clients/requests", element: <ReviewerClientRequestsView /> },
      {
        path: "clients/request/:id/review",
        element: <ReviewerClientRequestReviewView />,
      },
      {
        path: "clients/request/:id/reports",
        element: <ReviewerClientRequestReportsView />,
      },
      { path: "manufacturers", element: <ReviewerManufacturersView /> },
      { path: "manufacturer/:id", element: <ReviewerSingleManufacturerView /> },
      { path: "reviews-queue", element: <ReviewerReviewsQueueView /> },
      { path: "approved-reviews", element: <ReviewerApprovedReviewsView /> },
      { path: "drafted-reviews", element: <ReviewerDraftedReviewsView /> },
      { path: "new-review", element: <ReviewerNewReviewView /> },
      { path: "client/:id", element: <ReviewerClientView /> },
      { path: "auditor", element: <ReviewerAuditorView /> },
      { path: "profile", element: <ReviewerProfile /> },
      { path: "trash", element: <TrashView /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
  // CLIENT routes
  {
    path: "/client",
    element: <PrivateRoute component={ClientDashboardLayout} />,
    children: [
      { path: "dashboard", element: <ClientDashboardView /> },
      { path: "new-request", element: <ClientRequestViewNew /> },
      { path: "requests", element: <ClientRequestsView /> },
      { path: "documents", element: <ClientDocumentsView /> },
      { path: "help", element: <ClientHelpView /> },
      { path: "facilities", element: <ClientFacilitiesView /> },
      { path: "products", element: <ClientProductsView /> },
      { path: "heds", element: <ClientHedsView /> },
      { path: "request/:id", element: <ClientRequestView /> },
      {
        path: "request/:id/corrections",
        element: <ClientRequestCorrectionsView />,
      },
      {
        path: "request/:id/certificates",
        element: <ClientRequestCertifcatesView />,
      },
      {
        path: "reports",
        element: <ClientReportsView />,
        // children: [],
      },
      { path: "reports/document", element: <ClientReviewReportsView /> },
      { path: "reports/audit", element: <ClientAuditReportsView /> },
      { path: "certificates", element: <ClientCertificatesView /> },
      { path: "profile", element: <ClientProfile /> },
      { path: "profile/edit", element: <ClientProfileEdit /> },
      { path: "change-password", element: <ChangePasswordView /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
];

// necessary to wrap, to prevent link cache from same comp
// eg: loading this from /client/request/:id
function ClientRequestViewNew() {
  return <ClientRequestView />;
}

// @TODO type
function PrivateRoute({ component, ...rest }: any) {
  const Component = component;
  const auth = new Auth();

  return auth.isAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate
      to={`/login?referrer=${REFERRER}`}
      state={{ from: rest.location }}
    />
  );
}

export default routes;
