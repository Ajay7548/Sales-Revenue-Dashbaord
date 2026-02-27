import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    // baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  }),
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (filters) => ({
        url: "/analytics/summary",
        params: filters,
      }),
      providesTags: ["Analytics"],
    }),
    getTrends: builder.query({
      query: (filters) => ({
        url: "/analytics/trends",
        params: filters,
      }),
      providesTags: ["Analytics"],
    }),
    getProducts: builder.query({
      query: (filters) => ({
        url: "/analytics/products",
        params: { limit: 10, ...filters },
      }),
      providesTags: ["Analytics"],
    }),
    getRegions: builder.query({
      query: (filters) => ({
        url: "/analytics/regions",
        params: filters,
      }),
      providesTags: ["Analytics"],
    }),
    getCategories: builder.query({
      query: (filters) => ({
        url: "/analytics/categories",
        params: filters,
      }),
      providesTags: ["Analytics"],
    }),
    getFilters: builder.query({
      query: () => "/analytics/filters",
      providesTags: ["Analytics"],
    }),
    getTopReviewed: builder.query({
      query: (filters) => ({
        url: "/analytics/top-reviewed",
        params: { limit: 10, ...filters },
      }),
      providesTags: ["Analytics"],
    }),
    getDiscountDistribution: builder.query({
      query: (filters) => ({
        url: "/analytics/discount-distribution",
        params: filters,
      }),
      providesTags: ["Analytics"],
    }),
    getTableData: builder.query({
      query: (params) => ({
        url: "/analytics/table",
        params,
      }),
      providesTags: ["Analytics"],
    }),
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetSummaryQuery,
  useGetTrendsQuery,
  useGetProductsQuery,
  useGetRegionsQuery,
  useGetCategoriesQuery,
  useGetFiltersQuery,
  useGetTopReviewedQuery,
  useGetDiscountDistributionQuery,
  useGetTableDataQuery,
  useUploadFileMutation,
} = analyticsApi;
