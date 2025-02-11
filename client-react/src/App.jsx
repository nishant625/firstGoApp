import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from "axios";
import Clock from 'react-clock';  // Import the react-clock package
import 'react-clock/dist/Clock.css';  // Import the default clock styles

import './App.css';

const queryClient = new QueryClient();

function CurrentTime(props) {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: [props.api],
    queryFn: () =>
      axios
        .get(`${props.api}`)
        .then((res) => res.data),
  });

  if (isLoading) return `Loading ${props.api}...`;

  if (error) return "An error has occurred: " + error.message;

  // Convert fetched time to Date object
  const fetchedTime = new Date(data.now);

  return (
    <div className="App">
      <p>---</p>
      <p>API: {data.api}</p>
      <p>Time from DB:</p>
      {/* Display the fetched time in a clock */}
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
      <h1>This is my first golang api with react js as frontend</h1>
      <CurrentTime api="/api/golang/" />
      <CurrentTime api="/api/node/" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
