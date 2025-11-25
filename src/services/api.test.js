import axios from "axios";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProductComparison
} from "./api";

jest.mock("axios");

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

describe("API Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("registerUser should send email and password", async () => {
    const mockResponse = { data: { message: "ok" } };
    axios.post.mockResolvedValue(mockResponse);

    const result = await registerUser("a@a.com", "123");

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/api/auth/register`, {
      email: "a@a.com",
      password: "123",
    });

    expect(result).toEqual(mockResponse.data);
  });

  test("loginUser should send credentials to backend", async () => {
    const mockResponse = { data: { access_token: "abc" } };
    axios.post.mockResolvedValue(mockResponse);

    const result = await loginUser("a@a.com", "123");

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/api/auth/login`, {
      email: "a@a.com",
      password: "123",
    });

    expect(result).toEqual(mockResponse.data);
  });

  test("forgotPassword should call backend with email", async () => {
    const mockResponse = { data: { message: "sent" } };
    axios.post.mockResolvedValue(mockResponse);

    const result = await forgotPassword("a@a.com");

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/api/auth/forgot-password`,
      { email: "a@a.com" }
    );

    expect(result).toEqual(mockResponse.data);
  });

  test("resetPassword should call backend with token and new password", async () => {
    const mockResponse = { data: { message: "updated" } };
    axios.post.mockResolvedValue(mockResponse);

    const result = await resetPassword("token123", "novaSenha");

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/api/auth/reset-password`,
      {
        token: "token123",
        new_password: "novaSenha",
      }
    );

    expect(result).toEqual(mockResponse.data);
  });

  test("getProductComparison should call the API with correct params", async () => {
    const mockResponse = { data: { results_by_source: {}, overall_best_deal: {} } };
    axios.get.mockResolvedValue(mockResponse);

    const result = await getProductComparison("RTX 5090");

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/api/products/comparison`,
      { params: { q: "RTX 5090" } }
    );

    expect(result).toEqual(mockResponse.data);
  });
});
