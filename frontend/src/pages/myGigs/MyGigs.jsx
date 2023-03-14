import React from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "./../../utils/newRequest";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

function MyGigs() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGig"],
    queryFn: () =>
      newRequest.get(`gig/?userId=${currentUser._id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGig"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id)
  }

  return (
    <div className="myGigs">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="title">
            <h1>{currentUser.isSeller ? "Gigs" : "Orders"}</h1>
            {currentUser.isSeller && (
              <Link to="/add">
                <button>Add New Gig</button>
              </Link>
            )}
          </div>
          <table>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Action</th>
            </tr>
            {data.map((gig) => (
              <tr key={gig._id}>
                <td>
                  <img
                    className="image"
                    src={gig.cover}
                    alt=""
                  />
                </td>
                <td>{gig.title}</td>
                <td>
                  {gig.price}
                </td>
                <td>{gig.sales}</td>
                <td>
                  <img
                    className="delete"
                    src="./img/delete.png"
                    alt=""
                    onClick={() => handleDelete(gig._id)}
                  />
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
}

export default MyGigs;
