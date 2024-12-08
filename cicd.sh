#!/bin/bash

# print to screen with colour
print_message() {
  local short_message=$1
  local long_message=$2
  local colour=$3
  local verboseArg=$4
  local return=$5
  local return_str="\n"

  local colour_code=""
  local end_code="\e[0m"

  case $colour in
    "red")
      colour_code="\e[31m"
      ;;
    "blue")
      colour_code="\e[34m"
      ;;
    *)
      colour_code=""
      end_code=""
      ;;
  esac

  if [ "$verboseArg" = "verbose" ]; then
      printf "%b\n" "$long_message"
  fi

  if [ "$return" = "in-line" ]; then
    return_str=""
  fi

  printf "${colour_code}%b%b${end_code}" "$short_message" "$return_str"

}



# Formatting / linting TypeScript files
print_message "Formatting/linting of TypeScript" "" "blue" "" "in-line"

output=$(npx prettier --config .prettierrc --check './utils/**/*.ts' './src/**/*.ts' --color 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message " - fail\n" "" "red"
  print_message "Formatting/linting of TypeScript - failed!" "Error: $output" "red" "verbose"
  exit $exit_code
fi

print_message " - pass" "" "blue"



# Pre-render unit tests
print_message "Pre-render unit testing" "" "blue" "" "in-line"
cd utils || return
output=$(npm exec npx jest tests/pre-render/*.ts 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message " - fail\n" "" "red"
  print_message "Pre-render unit testing - failed!" "Error: $output" "red" "verbose"
  exit $exit_code
fi

print_message " - pass" "" "blue"
cd ..



# Create timeline pages
print_message "Creating timeline pages" "" "blue" "" "in-line"
output=$(npm exec ts-node utils/timeline-main.ts 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message " - fail\n" "" "red"
  print_message "Creating timeline pages - failed!" "Error: $output" "red" "verbose"
  exit $exit_code
fi

print_message " - pass" "" "blue"



# Create chapter page and sidebar
print_message "Creating chapter page and side bar" "" "blue" "" "in-line"
cd utils || return
output=$(npm exec ts-node chapters.ts 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message " - fail\n" "" "red"
  print_message "Creating chapter page and side bar - failed!" "Error: $output" "red" "verbose"
  exit $exit_code
fi

print_message " - pass" "" "blue"
cd ..


# Transpiling browser scripts
print_message "Transpiling browser scripts" "" "blue" "" "in-line"
cd src || return
output=$(npm exec tsc  2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message " - fail\n" "" "red"
  print_message "Transpile browser scripts - failed!" "Error: $output" "red" "verbose"
  exit $exit_code
fi

print_message " - pass" "" "blue"
cd ..


# Create static site
print_message "Creating Quarto static pages" "" "blue" "" "in-line"
output=$(quarto render 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message " - fail\n" "" "red"
  print_message "Creating Quarto static pages - failed!" "Error: $output" "red" "verbose"
  exit $exit_code
fi

print_message " - pass" "" "blue"


# Create page banners
print_message "Creating page banners" "" "blue" "" "in-line"
cd utils || return
output=$(npm exec ts-node banners.ts 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message " - fail\n" "" "red"
  print_message "Creating page banners - failed!" "Error: $output" "red" "verbose"
  exit $exit_code
fi

print_message " - pass" "" "blue"
cd ..


# Create code documents
print_message "Creating code documentation" "" "blue" "" "in-line"
cd docs || return
output=$(npx typedoc --entryPoints ../utils/*.ts --entryPoints ../src/*ts --out ../_site/chapters/code-documentation 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message " - fail\n" "" "red"
  print_message "Creating code documentation - failed!" "Error: $output" "red" "verbose"
  exit $exit_code
fi

print_message " - pass" "" "blue"
cd ..


# Post-render unit tests
print_message "Post-render unit tests" "" "blue" "" "in-line"
cd utils || return
output=$(npm exec npx jest tests/post-render/*.ts 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message " - fail\n" "" "red"
  print_message "Post-render unit tests - failed!" "Error: $output" "red" "verbose"
  exit $exit_code
fi

print_message " - pass" "" "blue"
cd ..


print_message "All tasks completed successfully" "" "blue"
