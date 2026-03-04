"use client";

import React, { useMemo, useState } from "react";
import * as topojson from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { motion } from "framer-motion";
import MapData from "@/constants/japan.json";
import { PREF_TO_REGION, REGIONS, RegionId, RegionInfo } from "./mapData";

function PrefPath({
  d, regionInfo, isSelected, isHovered,
  onMouseEnter, onMouseLeave, onClick, prefName,
}: {
  d: string;
  regionInfo: RegionInfo;
  isSelected: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  prefName: string;
}) {
  const fill = isSelected
    ? "#005F02"
    : isHovered
    ? regionInfo.hoverColor
    : regionInfo.color;

  return (
    <motion.path
      d={d}
      fill={fill}
      stroke="white"
      strokeWidth={0.6}
      style={{ cursor: "pointer", outline: "none" }}
      animate={{ fill }}
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.015 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      aria-label={prefName}
    />
  );
}

interface JapanMapProps {
  value?: RegionId | null;
  onChange?: (id: RegionId | null) => void;
}

export function JapanMap({ value, onChange }: JapanMapProps = {}) {
  const [internal, setInternal] = useState<RegionId | null>(null);
  const [hovered, setHovered] = useState<RegionId | null>(null);

  const controlled = value !== undefined;
  const selected = controlled ? value : internal;

  const toggle = (id: RegionId) => {
    const next = selected === id ? null : id;
    if (controlled) {
      onChange?.(next);
    } else {
      setInternal(next);
      onChange?.(next);
    }
  };

  const geoJsonData = useMemo(() => {
    // @ts-ignore
    const fc = topojson.feature(MapData, MapData.objects.japan);
    return fc as unknown as FeatureCollection<Geometry, GeoJsonProperties>;
  }, []);

  const projection = useMemo(() =>
    geoMercator().center([137.0, 38.2]).scale(1600).translate([530, 400]),
  []);

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

  return (
    <div>
      <svg
        viewBox="0 0 1060 800"
        className="w-full"
        style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.06))" }}
      >
        <g>
          {geoJsonData.features.map((feature, index) => {
            const prefId: number = (feature.properties?.id as number) ?? index + 1;
            const regionId = PREF_TO_REGION[prefId];
            if (!regionId) return null;
            const regionInfo = REGIONS[regionId];
            const d = pathGenerator(feature) ?? "";
            const prefName: string = (feature.properties?.name as string) ?? "";
            return (
              <PrefPath
                key={`pref-${prefId}`}
                d={d}
                regionInfo={regionInfo}
                isSelected={selected === regionId}
                isHovered={hovered === regionId}
                onMouseEnter={() => setHovered(regionId)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => toggle(regionId)}
                prefName={prefName}
              />
            );
          })}
        </g>
      </svg>

      {/* 凡例 */}
      <div className="flex flex-wrap gap-4 mt-3 px-1">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#005F02" }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#005F02" }} />
          活動中のLC
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#000000", opacity: 0.4 }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(0,95,2,0.18)" }} />
          準備中
        </div>
        {selected && (
          <button
            onClick={() => toggle(selected)}
            className="ml-auto text-xs flex items-center gap-1 transition-all hover:opacity-70"
            style={{ color: "#000000" }}
          >
            <span>選択を解除</span>
            <span>✕</span>
          </button>
        )}
      </div>
    </div>
  );
}
