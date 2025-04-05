import { useLocation } from "react-router-dom";

export default function Response() {

  const location = useLocation();

  const { text } = location.state || '';

  console.log(text);

  return (
    <>

      <h1 style={{ color: "white" }}>
        {text}
      </h1>

    </>
  )
}
