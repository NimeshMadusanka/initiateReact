import React, { Fragment, useEffect, useMemo, useState, useRef } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import { useStyles } from "utils/styles/styles";

import {
  TextField,
  Popper,
  Grid,
  Typography,
  InputAdornment,
  Button,
} from "@material-ui/core";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

export default function SearchLocation({
  setFieldValue,
  setInitialValues,
  setZipCode,
}) {
  const classes = useStyles();
  const [value, setValue] = useState({
    description: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const loaded = useRef(false);
  const [placesId, setPlacesId] = useState("");

  const getPlacesPostCodeById = async (placeId) =>
    new Promise((resolve, reject) => {
      if (!placeId) reject("placeId not provided");

      try {
        new window.google.maps.places.PlacesService(
          document.createElement("div")
        ).getDetails(
          {
            placeId,
            fields: ["address_components"],
          },
          (details) => {
            let postcode = null;
            details?.address_components?.forEach((entry) => {
              if (entry.types?.[0] === "postal_code") {
                postcode = entry.long_name;
              }
            });
            setZipCode(postcode);
            setFieldValue("zipCode", postcode);
            return resolve(postcode);
          }
        );
      } catch (e) {
        reject(e);
      }
    });

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_PLACES_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const PopperMy = function (props) {
    return <Popper {...props} placement="none" />;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await getPlacesPostCodeById(placesId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Fragment>
      <Autocomplete
        PopperComponent={PopperMy}
        size="small"
        id="google-map-demo"
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.description
        }
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        defaultValue={{
          description: "Homagama",
        }}
        value={value}
        onChange={(event, newValue) => {
          if (newValue) {
            setOptions(newValue ? [newValue, ...options] : options);

            setValue(newValue);
            setPlacesId(newValue.place_id);
            setFieldValue("address", newValue.description);
            setInitialValues((pre) => ({
              ...pre,
              address: newValue.description,
            }));
            setValue(null);
          } else {
            setValue(null);
            setFieldValue("coordinates.lat", null);
            setFieldValue("coordinates.lng", null);
          }
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <div>
            <TextField
              {...params}
              variant="outlined"
              defaultValue={{
                description: "Homagama",
              }}
              placeholder="Street Address"
              InputLabelProps={{ shrink: false }}
              InputProps={{
                ...params.InputProps,

                startAdornment: (
                  <InputAdornment
                    style={{ marginRight: "2rem" }}
                    position="start"
                  >
                    <GpsFixedIcon className={classes.gpsIcon} />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <Grid style={{ marginTop: "1rem" }}>
              <Button variant="contained" color="primary" onClick={handleClick}>
                Get zipcode
              </Button>
            </Grid>
          </div>
        )}
        renderOption={(option) => {
          let parts = [];
          if (option.structured_formatting) {
            const matches =
              option.structured_formatting.main_text_matched_substrings;
            parts = parse(
              option.structured_formatting.main_text,
              matches.map((match) => [
                match.offset,
                match.offset + match.length,
              ])
            );
          }
          return (
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnIcon className={classes.icon} />
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}

                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting &&
                    option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
      />
    </Fragment>
  );
}
