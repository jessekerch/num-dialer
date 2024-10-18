import { useState, useEffect } from "react";
import { getNumbers, callNumbers, BASE_URL } from "./services/api.js";
import { Number } from "./components/Number.jsx";

function App() {
  const [numbers, setNumbers] = useState([]);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setBtnDisabled(true);
    callNumbers();
  };

  useEffect(() => {
    const eventSource = new EventSource(BASE_URL + "/sse");

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      console.log("newData in App.jsx: ", newData);
      // {number: '13018040009', status: 'answered'}
      // console.log("numbers is : ", numbers);

      setNumbers((prevNumbers) =>
        prevNumbers.map((n, i) => {
          // console.log("newData.idx is: ", newData.idx);
          // console.log("n and i are: ", n, i);
          // console.log("prevNumbers is: ", prevNumbers);

          return i !== newData.idx
            ? n
            : { number: newData.number, status: newData.status };
        })
      );
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const getNums = async () => {
      try {
        const numList = await getNumbers();
        setNumbers(
          numList.map((num, idx) => {
            return { number: num, status: "idle" };
          })
        );
      } catch (error) {
        console.error(error);
      }
    };

    getNums();

    // eventSource send request to localhost server with path
    // get response and set numbers
  }, []);

  // Connect to a SSE server from a browser
  // const evtSource = new EventSource("/stream");

  // eventSource.addEventListener('message', event => {  // Event listener on the front-end
  //     console.log(event.data);
  // }

  return (
    <>
      <div>
        <h1>Numbers</h1>
        {numbers.map((num, idx) => {
          return (
            <Number
              key={num.number + idx}
              number={num.number}
              status={num.status}
            />
          );
        })}
        {/* <ul>
          <Number number={number} status={status} />
        </ul> */}
      </div>
      <button disabled={btnDisabled} onClick={handleClick}>
        CALL
      </button>
    </>
  );
}

export default App;
