import { DataProvider, HttpError } from "@refinedev/core";
import axios, { AxiosError } from "axios";

const apiUrl = "/api";

export const apiClient = axios.create({
  baseURL: apiUrl,
});

const dataProvider: DataProvider = {
  // required methods
  getList: async ({ resource, pagination, filters, sorters }) => {
    try {
      const { current, pageSize } = pagination ?? {};

      // Convert filters to API parameters
      const filterParams = filters?.reduce((acc, filter) => {
        switch (filter.operator) {
          case "eq":
            acc[filter.field] = filter.value;
            break;
          case "contains":
            acc[`${filter.field}_like`] = filter.value;
            break;
          // Add more operators as needed
        }
        return acc;
      }, {} as any);

      // Convert sorters to API parameters
      const sortParams = sorters?.reduce((acc, sorter) => {
        acc._sort = sorter.field;
        acc._order = sorter.order.toLowerCase(); // 'asc' or 'desc'
        return acc;
      }, {} as any);

      // Combine all parameters
      const response = await apiClient.get(`/${resource}`, {
        params: {
          _page: current,
          _limit: pageSize,
          ...filterParams,
          ...sortParams,
        },
      });

      // The total row count could be sourced differently based on the provider
      const data = response.data.data;
      const total = response.data.total;

      return {
        data,
        total,
      };
    } catch (err: any) {
      const error: HttpError = {
        message: err.response?.data?.message || err?.message,
        statusCode: err?.status || 500,
      };

      return Promise.reject(error);
    }
  },
  create: async ({ resource, variables }) => {
    try {
      const response = await apiClient.post(`/${resource}`, variables);

      return {
        data: response.data.data,
      };
    } catch (err: any) {
      const error: HttpError = {
        message: err.response?.data?.message || err?.message,
        statusCode: err?.status || 500,
      };

      return Promise.reject(error);
    }
  },
  update: async ({ resource, id, variables }) => {
    try {
      const response = await apiClient.put(`/${resource}/${id}`, variables);

      return {
        data: response.data.data,
      };
    } catch (err: any) {
      const error: HttpError = {
        message: err.response?.data?.message || err?.message,
        statusCode: err?.status || 500,
      };

      return Promise.reject(error);
    }
  },
  deleteOne: async ({ resource, id }) => {
    try {
      await apiClient.delete(`/${resource}/${id}`);

      return {
        data: {} as any,
      };
    } catch (err: any) {
      const error: HttpError = {
        message: err.response?.data?.message || err?.message,
        statusCode: err?.status || 500,
      };
      return Promise.reject(error);
    }
  },
  getOne: async ({ resource, id }) => {
    try {
      const response = await apiClient.get(`/${resource}/${id}`);

      return {
        data: response.data.data,
      };
    } catch (err: any) {
      const error: HttpError = {
        message: err.response?.data?.message || err?.message,
        statusCode: err?.status || 500,
      };

      return Promise.reject(error);
    }
  },
  getApiUrl: () => apiUrl,
  // optional methods
  // getMany: ({ resource, ids, meta }) => Promise,
  // createMany: ({ resource, variables, meta }) => Promise,
  // deleteMany: ({ resource, ids, variables, meta }) => Promise,
  // updateMany: ({ resource, ids, variables, meta }) => Promise,
  // custom: ({ url, method, filters, sorters, payload, query, headers, meta }) =>
  //   Promise,
};

export default dataProvider;
