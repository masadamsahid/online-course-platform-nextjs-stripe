"use client"

import { Category } from "@prisma/client";
import { IconType } from "react-icons";
import { FcBullish, FcBusiness, FcCommandLine, FcConferenceCall, FcDocument, FcEditImage, FcEngineering, FcFilmReel, FcFolder, FcGlobe, FcHeatMap, FcMindMap, FcMultipleDevices, FcMusic, FcOldTimeCamera, FcPicture, FcPortraitMode, FcSafe, FcSalesPerformance, FcSignature, FcSportsMode } from "react-icons/fc";
import CategoryItem from "./category-item";

const iconmMap: Record<Category["name"], IconType> = {
  "Software Engineering": FcMultipleDevices,
  "Data": FcHeatMap,
  "Web Development": FcGlobe,
  "Cloud Computing": FcCommandLine,
  "Artificial IIntelligence": FcMusic,
  "Computer Networking": FcMindMap,
  "Engineering": FcEngineering,
  "Business": FcBusiness,
  "Sports": FcSportsMode,
  "Music": FcMusic,
  "Arts": FcSignature,
  "Drawing": FcEditImage,
  "Writting": FcDocument,
  "Photography": FcOldTimeCamera,
  "Videography": FcFilmReel,
  "Marketing": FcBullish,
  "Accounting": FcSalesPerformance,
  "Human Resources": FcConferenceCall,
  "Management": FcSafe,
  "Self Improvement": FcPortraitMode,
  "other": FcFolder,
};

type CategoriesProps = {
  items: Category[];
}

const Categories = ({ items, ...props }: CategoriesProps) => {

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconmMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
}

export default Categories;