import { useState, useEffect } from 'react';
import { Card, Table, Pagination } from 'react-bootstrap';
import { useNavigate,useLocation } from "react-router-dom";

const perPage = 10;
export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();
  const location = useLocation();

  async function loadRestaurants() {
    setIsLoading(true);
    const search = location.search;
    const borough = new URLSearchParams(search).get('borough');
    let url = `https://web422-a1-2221-weisong.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`;
    if (borough) {
      url += `&borough=${borough}`;
    }
    let res = await fetch(url);
    let data = await res.json();
    setRestaurants(data);
    setIsLoading(false);
  }
  useEffect(() => {
    loadRestaurants();
  }, [page,location]);

  function previousPage() {
    if (page > 1) {
      setPage(page - 1);

    }
  }
  function nextPage() {
    setPage(page + 1);
  }
  const tableItems = restaurants.map((restaurant) => {
    return <tr onClick={() => { navigate(`/restaurant/${restaurant._id}`) }} key={restaurant._id}>
      <td>{restaurant.name ?? "Not given"}</td>
      <td>{restaurant.address.building ?? ""} {restaurant.address.street ?? ""}</td>
      <td>{restaurant.borough ?? ""}</td>
      <td>{restaurant.cuisine ?? ""}</td>
    </tr>

  }
  );
  if (isLoading) {
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>Restaurant List</Card.Title>
            <Card.Text>
              Optionally sorted by Borough
            </Card.Text>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Loading</Card.Title>
            <Card.Text>
              Loading Restaurants . . . .
            </Card.Text>
          </Card.Body>
        </Card>
        <Pagination>
          <Pagination.Prev onClick={previousPage} />
          <Pagination.Item onClick={() => { console.log("Already loaded") }}>{page}</Pagination.Item>
          <Pagination.Next onClick={nextPage} />
        </Pagination>

      </>
    );
  }
  else if(restaurants.length===0){
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>Restaurant List</Card.Title>
            <Card.Text>
              Optionally sorted by Borough
            </Card.Text>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>No data</Card.Title>
            <Card.Text>
              Couldn't find any restaurant
            </Card.Text>
          </Card.Body>
        </Card>
      </>
    );
  }
  else {
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>Restaurant List</Card.Title>
            <Card.Text>
              Optionally sorted by Borough
            </Card.Text>
          </Card.Body>
        </Card>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Borough</th>
              <th>Cuisine</th>
            </tr>
          </thead>
          <tbody>
            {tableItems}
          </tbody>
        </Table>

        <Pagination>
          <Pagination.Prev onClick={previousPage} />
          <Pagination.Item onClick={() => { console.log("Already loaded") }}>{page}</Pagination.Item>
          <Pagination.Next onClick={nextPage} />
        </Pagination>

      </>
    );
  }

}