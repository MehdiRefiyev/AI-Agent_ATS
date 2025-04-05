import { NavLink, useLocation } from "react-router-dom";

export default function Response() {

  const location = useLocation();

  const { name } = location.state || {};

  console.log(name);

  return (
    <>

      <h1 style={{ color: "white" }}>
        <NavLink to="/">Home</NavLink>
      </h1>

    </>
  )
}
