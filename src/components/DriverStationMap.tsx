import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface DriverMapStation {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  availabilitySummary?: string;
}

interface DriverStationMapProps {
  stations: DriverMapStation[];
  selectedStationId: string | null;
  onStationSelect: (stationId: string) => void;
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [106.70098, 10.776889];

type MarkerEntry = {
  marker: mapboxgl.Marker;
  element: HTMLButtonElement;
};

function applyMarkerStyles(element: HTMLButtonElement, isSelected: boolean) {
  element.style.width = isSelected ? "26px" : "22px";
  element.style.height = isSelected ? "26px" : "22px";
  element.style.borderRadius = "9999px";
  element.style.border = "3px solid #ffffff";
  element.style.backgroundColor = isSelected ? "#1d4ed8" : "#2563eb";
  element.style.boxShadow = isSelected
    ? "0 8px 16px rgba(37, 99, 235, 0.45)"
    : "0 6px 12px rgba(37, 99, 235, 0.35)";
  element.style.color = "#ffffff";
  element.style.fontSize = "10px";
  element.style.fontWeight = "600";
  element.style.display = "flex";
  element.style.alignItems = "center";
  element.style.justifyContent = "center";
  element.style.cursor = "pointer";
  element.style.transition = "transform 120ms ease, box-shadow 120ms ease";
  element.style.transform = isSelected ? "translateY(-2px) scale(1.05)" : "translateY(0) scale(1)";
}

export default function DriverStationMap({
  stations,
  selectedStationId,
  onStationSelect,
  className,
}: DriverStationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Record<string, MarkerEntry>>({});
  const initialCenterRef = useRef<[number, number]>(
    stations[0]?.coordinates ?? DEFAULT_CENTER
  );

  const env = import.meta.env as Record<string, string | undefined>;
  const mapboxToken = env.VITE_MAPBOX_ACCESS_TOKEN ?? env.MAPBOX_ACCESS_TOKEN;
  const hasToken = typeof mapboxToken === "string" && mapboxToken.length > 0;

  const containerClassName = useMemo(() => {
    const base = [
      "relative",
      "overflow-hidden",
      "rounded-xl",
      "shadow-sm",
    ];
    if (className) {
      base.push(className);
    } else {
      base.push("h-64");
    }
    return base.join(" ");
  }, [className]);

  useEffect(() => {
    if (!hasToken) {
      return;
    }
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = mapboxToken as string;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenterRef.current,
      zoom: 12.5,
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    mapRef.current = map;

    return () => {
      Object.values(markersRef.current).forEach((entry) => entry.marker.remove());
      markersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
  }, [hasToken, mapboxToken]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    Object.values(markersRef.current).forEach((entry) => entry.marker.remove());
    markersRef.current = {};

    stations.forEach((station) => {
      const element = document.createElement("button");
      element.type = "button";
      element.textContent = "EV";
      element.setAttribute("aria-label", `Select station ${station.name}`);
      applyMarkerStyles(element, false);

      const popupNode = document.createElement("div");
      popupNode.style.fontSize = "12px";
      popupNode.style.color = "#1f2937";
      popupNode.style.maxWidth = "240px";
      popupNode.style.lineHeight = "1.25";

      const titleNode = document.createElement("strong");
      titleNode.textContent = station.name;
      popupNode.appendChild(titleNode);

      if (station.availabilitySummary) {
        const availabilityNode = document.createElement("div");
        availabilityNode.textContent = station.availabilitySummary;
        availabilityNode.style.marginTop = "4px";
        popupNode.appendChild(availabilityNode);
      }

      if (station.address) {
        const addressNode = document.createElement("div");
        addressNode.textContent = station.address;
        addressNode.style.marginTop = "4px";
        popupNode.appendChild(addressNode);
      }

      const marker = new mapboxgl.Marker({ element, anchor: "bottom" })
        .setLngLat(station.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 18, closeButton: false }).setDOMContent(popupNode));

      element.addEventListener("click", (event) => {
        event.stopPropagation();
        onStationSelect(station.id);
        const popup = marker.getPopup();
        if (popup && map) {
          popup.addTo(map);
        }
      });

      marker.addTo(map);
      markersRef.current[station.id] = { marker, element };
    });

    return () => {
      Object.values(markersRef.current).forEach((entry) => entry.marker.remove());
      markersRef.current = {};
    };
  }, [stations, onStationSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    Object.entries(markersRef.current).forEach(([id, entry]) => {
      applyMarkerStyles(entry.element, id === selectedStationId);
    });

    if (!selectedStationId) {
      return;
    }

    const selectedEntry = markersRef.current[selectedStationId];
    const selectedStation = stations.find((station) => station.id === selectedStationId);

    if (selectedEntry && selectedStation) {
      map.flyTo({
        center: selectedStation.coordinates,
        zoom: Math.max(map.getZoom(), 12.8),
        duration: 650,
        essential: true,
      });

      const popup = selectedEntry.marker.getPopup();
      if (popup && !popup.isOpen()) {
        popup.addTo(map);
      }
    }
  }, [selectedStationId, stations]);

  if (!hasToken) {
    return (
      <div className={`${containerClassName} flex items-center justify-center bg-gray-100 text-sm text-gray-600`}>
        Map preview unavailable. Configure VITE_MAPBOX_ACCESS_TOKEN in .env.
      </div>
    );
  }

  return <div ref={mapContainerRef} className={`${containerClassName} bg-gray-200`} />;
}

