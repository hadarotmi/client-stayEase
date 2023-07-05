import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { debounce } from '@mui/material/utils';

const BING_MAPS_API_KEY = 'AkWIY0rD6DKDqQZxXT9rHFhbG8qG1piweyqKVpfOpbJHZKn8pt-1AZpQr_xWWMJs';

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

export default function Test() {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#bing-maps')) {
      loadScript(
        `https://www.bing.com/api/maps/mapcontrol?callback=initMap&key=${BING_MAPS_API_KEY}`,
        document.querySelector('head'),
        'bing-maps',
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        // בקשת ה-Autocomplete של Bing Maps
        const searchManager = new window.Microsoft.Maps.Search.SearchManager();
        const requestOptions = {
          count: 5, // מספר התוצאות שיוחזרו
          bounds: window.Microsoft.Maps.LocationRect.fromCorners(
            new window.Microsoft.Maps.Location(85, -180),
            new window.Microsoft.Maps.Location(-85, 180)
          ), // תיבת החיפוש בעולם
          where: request.input
        };

        searchManager.geocode(requestOptions, callback);
      }, 400),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.Microsoft && window.Microsoft.Maps) {
      // יצירת שירות ה-Autocomplete של Bing Maps
      autocompleteService.current = new window.Microsoft.Maps.AutocompleteManager();
    }

    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results && results.results) {
          newOptions = [...newOptions, ...results.results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="bing-map-demo"
      sx={{ width: 300 }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.name
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No locations"
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Add a location" fullWidth />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: 'flex', width: 44 }}>
                <LocationOnIcon sx={{ color: 'text.secondary' }} />
              </Grid>
              <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                {option.name}
                <Typography variant="body2" color="text.secondary">
                  {option.address.formattedAddress}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );}