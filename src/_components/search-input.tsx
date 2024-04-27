"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { Input } from "@/_components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SearchInputProps = {}

const SearchInput = (props: SearchInputProps) => {
  
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);
  
  const searhParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentCategoryId = searhParams.get("categoryId");
  
  useEffect(() => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        categoryId: currentCategoryId,
        title: debouncedValue,
      },
    }, { skipNull: true, skipEmptyString: true });
    router.push(url);
  },[debouncedValue, currentCategoryId, router, pathname]);
  
  return (
    <div className="relative">
      <Search className="size-4 absolute top-3 left-3 text-slate-600" />
      <Input
        onChange={e => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course"
      />
    </div>
  );
}

export default SearchInput;