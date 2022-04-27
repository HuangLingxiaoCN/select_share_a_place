import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyC8EmbBVkZoOmkLGLR1R61uuc_C0BvduNM";

type GoogleGeocodingResponse = {
  results: { geometry: { locaiton: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS" | "INVALID_REQUEST";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // Send this to Google api
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}
  `
    )
    .then((response: any) => {
      if (response.data.status !== "OK") {
        throw new Error('Could not fetch locaiton!');
      }
      const coordinates = response.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: coordinates,
        zoom: 14,
      });

      new google.maps.Marker({
        position: coordinates,
        map: map,
      });

      console.log(coordinates)
    })
    .catch((error: Error) => {
      alert(error.message);
      console.log(error);
    });
}

form?.addEventListener("submit", searchAddressHandler);
