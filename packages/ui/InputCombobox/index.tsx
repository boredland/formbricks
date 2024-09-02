import { CheckIcon, ChevronDownIcon, LucideProps, XIcon } from "lucide-react";
import React, { useEffect } from "react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { cn } from "@formbricks/lib/cn";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../Command";
import { Input } from "../Input";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

export interface ComboboxOption<T = string | number> {
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  label: string;
  value: T;
  meta?: Record<string, string>;
}

export interface ComboboxGroupedOption {
  label: string;
  value: string | number;
  options: ComboboxOption[];
}

interface InputComboboxProps<T> {
  showSearch?: boolean;
  searchPlaceholder?: string;
  options?: ComboboxOption<T>[];
  groupedOptions?: ComboboxGroupedOption[];
  selected?: string | number | string[] | null;
  onChangeValue: (value: T | T[], option?: ComboboxOption) => void;
  inputProps?: React.ComponentProps<typeof Input>;
  clearable?: boolean;
  withInput?: boolean;
  comboboxSize?: "sm" | "lg";
  allowMultiSelect?: boolean;
  showCheckIcon?: boolean;
  comboboxClasses?: string;
}

export const InputCombobox = ({
  showSearch = true,
  searchPlaceholder = "Search...",
  options,
  inputProps,
  groupedOptions,
  selected,
  onChangeValue,
  clearable = false,
  withInput = false,
  // comboboxSize = "lg",
  allowMultiSelect = false,
  showCheckIcon = false,
  comboboxClasses,
}: InputComboboxProps<string | number>) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<ComboboxOption | ComboboxOption[] | null>(null);
  const [hideInput, setHideInput] = React.useState(false);

  useEffect(() => {
    const validOptions = options?.length ? options : groupedOptions?.flatMap((group) => group.options);
    if (validOptions?.find((option) => option.value === selected)) {
      setHideInput(true);
    }
  }, []);

  React.useEffect(() => {
    const validOptions = options?.length ? options : groupedOptions?.flatMap((group) => group.options);
    if (Array.isArray(selected)) {
      setValue(validOptions?.filter((option) => selected.includes(option.value as string)) || null);
    } else {
      setValue(validOptions?.find((option) => option.value === selected) || null);
    }
  }, [selected, options, groupedOptions]);

  const handleSelect = (option: ComboboxOption) => {
    let shouldHideInput = true;
    if (allowMultiSelect) {
      if (Array.isArray(value)) {
        const doesExist = value.find((item) => item.value === option.value);
        const newValue = doesExist ? value.filter((item) => item.value !== option.value) : [...value, option];
        if (!newValue.length) {
          shouldHideInput = false;
        }
        onChangeValue(newValue.map((item) => item.value));
        setValue(newValue);
      } else {
        onChangeValue([option.value], option);
        setValue([option]);
      }
    } else {
      onChangeValue(option.value, option);
      setValue(option);
      setOpen(false);
    }
    if (withInput) setHideInput(shouldHideInput);
  };

  return (
    <div className={cn("flex overflow-hidden rounded-md border border-slate-300", comboboxClasses)}>
      {withInput && !hideInput && (
        <Input className="min-w-0 rounded-none border-0 border-r border-slate-300 bg-white" {...inputProps} />
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            aria-controls="options"
            aria-expanded={open}
            className={cn("flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-white", {
              "rounded-l-none": withInput,
            })}>
            <div className="ellipsis flex w-full gap-2 truncate px-2">
              {Array.isArray(value) ? (
                value.map((item, idx) => (
                  <>
                    {idx !== 0 && <span>,</span>}
                    <div className="flex items-center gap-2">
                      {item?.icon && <item.icon className="h-5 w-5 shrink-0 text-slate-400" />}
                      <span>{item?.label}</span>
                    </div>
                  </>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  {value?.icon && <value.icon className="h-5 w-5 shrink-0 text-slate-400" />}
                  <span>{value?.label}</span>
                </div>
              )}
            </div>
            {clearable && selected ? (
              <XIcon
                className="shrink-0 text-slate-300"
                onClick={() => {
                  onChangeValue("");
                  setValue(null);
                  setHideInput(false);
                }}
              />
            ) : (
              <ChevronDownIcon className="shrink-0 text-slate-300" />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "max-h-[400px] w-[200px] overflow-y-auto border border-slate-400 bg-slate-50 p-0 shadow-none",
            {
              "pt-2": showSearch,
            }
          )}>
          <Command>
            {showSearch && (
              <CommandInput
                placeholder={searchPlaceholder}
                className="h-8 border-slate-400 bg-white placeholder-slate-300"
              />
            )}
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              {options && options.length > 0 ? (
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option)}
                      className="cursor-pointer truncate">
                      {showCheckIcon &&
                        ((allowMultiSelect &&
                          Array.isArray(value) &&
                          value.find((item) => item.value === option.value)) ||
                          (!allowMultiSelect && typeof value === "string" && value === option.value)) && (
                          <CheckIcon className="mr-2 h-4 w-4 text-slate-300" />
                        )}
                      {option.icon && <option.icon className="mr-2 h-5 w-5 shrink-0 text-slate-400" />}
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {groupedOptions?.map((group, idx) => (
                <>
                  {idx !== 0 && <CommandSeparator key={idx} className="bg-slate-300" />}
                  <CommandGroup heading={group.label}>
                    {group.options.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => handleSelect(option)}
                        className="cursor-pointer truncate">
                        {showCheckIcon &&
                          ((allowMultiSelect &&
                            Array.isArray(value) &&
                            value.find((item) => item.value === option.value)) ||
                            (!allowMultiSelect && typeof value === "string" && value === option.value)) && (
                            <CheckIcon className="mr-2 h-4 w-4 shrink-0 text-slate-300" />
                          )}
                        {option.icon && <option.icon className="mr-2 h-5 w-5 shrink-0 text-slate-400" />}
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};