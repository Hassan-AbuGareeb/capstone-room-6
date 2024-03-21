import { useEffect, useState, useContext } from "react";
import CustomerNav from "./customerNav";
import { TokenContext } from "../_app";
import { useRouter } from "next/router";

export default function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { haveToken, setHaveToken } = useContext(TokenContext);
  const router = useRouter();
  //dishes categories
  const categories = [
    "All",
    "Asian",
    "Bakery",
    "Beverages",
    "Breakfast",
    "Brunch",
    "Burgers",
    "Cafe",
    "Desserts",
    "Donuts",
    "Fast Food",
    "Grill",
    "Ice Cream",
    "Indian",
    "Italian",
    "Juices",
    "Middle Eastern",
    "Mexican",
    "Pastries",
    "Pizza",
    "Salads",
    "Sandwiches",
    "Seafood",
    "Smoothies",
    "Snacks",
    "Soups",
    "Traditional",
    "Vegan",
    "Vegetarian",
    "Wraps",
  ];
  //fetch all dishes from backend
  async function getDishes() {
    const dishesResponse = await fetch("http://localhost:3001/restaurants/get");
    const dishesData = await dishesResponse.json();
    setDishes([...dishesData]);
    setFilteredDishes([...dishesData]);
  }

  useEffect(() => {
    getDishes();
  }, []);

  useEffect(() => {
    setFilteredDishes([
      ...dishes.filter((dish) => {
        return dish.name.toLowerCase().includes(search.toLowerCase());
      }),
    ]);
  }, [search]);

  useEffect(() => {
    setFilteredDishes([
      ...dishes.filter((dish) => {
        if (category === "All") return true;
        return dish.category.includes(category);
      }),
    ]);
  }, [category]);

  async function addToCart(dishId) {
    const token = localStorage.getItem("token");
    const body = { quantity: 1 };
    const addResponse = await fetch(
      `http://localhost:3001/customer/basket/${dishId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(body),
      }
    );
    if (addResponse.status !== 200) {
      if (addResponse.stats === 500) {
        alert("Internal server error, please try again later");
      } else {
        //bad token
        alert("your session ended, please sign in again");
        localStorage.removeItem("token");
        setHaveToken(false);
        setTimeout(() => {
          router.push("/customer/SignUpIn");
        }, 3000);
      }
    } else {
      alert("item added successfully!");
    }
  }

  const filteredDishesCards = filteredDishes.map((dish) => {
    return (
      <div className="flex flex-col border-2 border-green-400 rounded-md">
        {/* dish image */}
        <h1>{dish.name}</h1>
        <h1>{dish.price.$numberDecimal}</h1>
        {haveToken && (
          <button
            onClick={() => {
              addToCart(dish._id);
            }}
          >
            Add to Cart
          </button>
        )}
      </div>
    );
  });

  // const filteredDishes
  return (
    <div>
      <CustomerNav />
      <div>{/* some big image here with text on it */}</div>
      {/* search modifiers */}
      <div className="flex justify-around"></div>
      <div className="flex felx-row gap-3">
        <label>search</label>
        <input type="text" value={search} onChange={handleSearchChange} />
      </div>
      {/* search bar */}
      <div>
        <select
          name="categories"
          defaultValue={"All"}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((category) => {
            return (
              <option value={category} key={category}>
                {category}
              </option>
            );
          })}
        </select>
      </div>
      {/* filter by categories */}
      {/* actual dishes */}
      <div className="flex gap-5">{filteredDishesCards}</div>
    </div>
  );

  function handleSearchChange(event) {
    setSearch(event.target.value);
  }
}