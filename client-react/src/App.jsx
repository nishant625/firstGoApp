import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from "axios";
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

import './App.css';

const queryClient = new QueryClient();

// Fetch the API URLs from environment variables
const GOLANG_API_URL = import.meta.env.VITE_API_GOLANG;
const NODE_API_URL = import.meta.env.VITE_API_NODE;

function CurrentTime({ apiUrl, apiName }) {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: [apiUrl],
    queryFn: () => axios.get(apiUrl).then((res) => res.data),
  });

  if (isLoading) return `Loading ${apiName}...`;
  if (error) return "An error has occurred: " + error.message;

  const fetchedTime = new Date(data.now);

  return (
    <div className="App">
      <p>---</p>
      <p>API: {apiName}</p>
      <p>Time from DB:</p>
      <Clock 
        value={fetchedTime} 
        renderNumbers={true} 
        className="custom-clock" 
      />
      <div>{isFetching ? "Updating..." : ""}</div>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>This is my first Golang API with React JS as frontend</h1>
      <CurrentTime apiUrl={GOLANG_API_URL} apiName="Golang API" />
      <CurrentTime apiUrl={NODE_API_URL} apiName="Node API" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
