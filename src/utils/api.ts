// https://grok.com/share/bGVnYWN5_fb509489-50bc-4309-978f-c20b5feb60c3

// Base URL for your API (replace with your actual API endpoint)
const BASE_URL: string = 'https://jsonplaceholder.typicode.com'; // Example API for testing

// Define a generic error interface
interface ApiError {
  message?: string;
}

// Define a generic response type
// interface ApiResponse<T> {
//   data: T;
//   status: number;
// }

// Helper function to handle fetch responses with generic type
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || `HTTP error! Status: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

// GET request with generic return type
export const get = async <T>(endpoint: string): Promise<T> => {
  try {
    const response: Response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization token here if needed, e.g., 'Authorization': `Bearer ${token}`
      },
    });
    return handleResponse<T>(response);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('GET Request Failed:', err.message);
    throw error; // Re-throw error for component-level handling
  }
};

// POST request with generic data and return types
export const post = async <T, D>(endpoint: string, data: D): Promise<T> => {
  try {
    const response: Response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization token here if needed
      },
      body: JSON.stringify(data), // Convert data to JSON string
    });
    return handleResponse<T>(response);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('POST Request Failed:', err.message);
    throw error; // Re-throw error for component-level handling
  }
};

// Example usage with specific types
// interface Post {
//   id?: number;
//   title: string;
//   body: string;
//   userId: number;
// }

// Example usage (you can remove these in your actual file)
// get<Post[]>('/posts') - Fetches a list of posts
// post<Post, Omit<Post, 'id'>>('/posts', { title: 'New Post', body: 'Content here', userId: 1 }) - Creates a new post