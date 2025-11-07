import { useEffect, useState } from "react";
import philippineCitiesAndProvinces from '../../../../public/philippines-locations.json';

export default function usePhilippineLocation(initialProvince?: string, initialCity?: string) {
  const [province, setProvince] = useState(initialProvince || "");
  const [city, setCity] = useState(initialCity || "");
  const [provinceList, setProvinceList] = useState<{ name: string; key: string }[]>([]);
  const [cityList, setCityList] = useState<{ name: string; province: string }[]>([]);

  useEffect(() => {
    // Load provinces from JSON
    const provinces = philippineCitiesAndProvinces.provinces;
    setProvinceList(provinces);

    // Determine default province
    const selectedProvince = initialProvince
      ? provinces.find((p) => p.name === initialProvince) || provinces[0]
      : provinces[0];

    setProvince(selectedProvince.name);

    // Filter and load cities for that province
    const cities = philippineCitiesAndProvinces.cities.filter(
      (city) => city.province === selectedProvince.key
    );
    setCityList(cities);

    // Determine default city
    const defaultCity = initialCity
      ? cities.find((c) => c.name === initialCity) || cities[0]
      : cities[0];

    if (defaultCity) setCity(defaultCity.name);
  }, [initialProvince, initialCity]);

  // Handler when province changes
  const handleProvinceChange = (provinceName: string) => {
    setProvince(provinceName);
    const provinceObj = provinceList.find((p) => p.name === provinceName);
    if (!provinceObj) return;

    const cities = philippineCitiesAndProvinces.cities.filter(
      (city) => city.province === provinceObj.key
    );
    setCityList(cities);
    if (cities.length > 0) setCity(cities[0].name);
  };

  return {
    province,
    setProvince: handleProvinceChange,
    city,
    setCity,
    provinceList,
    cityList,
  };
}
