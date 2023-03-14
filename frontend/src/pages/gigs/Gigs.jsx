import React, { useEffect, useRef } from "react";
import "./Gigs.scss";
import { useState } from "react";
import GigCard from './../../components/gigCard/GigCard';
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from 'react-router-dom';

function Gigs() {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState('');
  const minRef = useRef();
  const maxRef = useRef()

  const {search} = useLocation()

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['gigs'],
    queryFn: () =>
      newRequest.get(`gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`).then((res) => {
        return res.data
      })
  })

  const reSort = (type) => {
    setSort(type)
    setOpen(false)
  }

  useEffect(() => {
    refetch()
  }, [sort])
  
  const apply = () => {
    refetch()
  }

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">Liverr {">"} Graphics & Design {">"}</span>
        <h1>AI Artists</h1>
        <p>
          Explore the boundaries of art and technology with Liverr{"'"}s AI artists
        </p>
        <div className="menu">
          <div className="left">
            <span>Budged</span>
            <input type="text" placeholder="min" ref={minRef} />
            <input type="text" placeholder="max" ref={maxRef} />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">SortBy</span>
            <span className="sortType">{sort === 'sales' ? 'Best Selling' : 'Newest'}</span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                <span onClick={() => reSort('createAt')}>Newest</span>
                <span onClick={() => reSort('sales')}>Best Selling</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {
            isLoading ? 'loading' : error ? 'Something went wrong!' :
            data.map(gig => (
              <GigCard key={gig._id} item={gig} />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Gigs;
