#!/bin/bash
verbose=false

# print to screen with colour
print_message() {
  local short_message=$1
  local long_message=$2
  local colour=$3

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

  if [ "$verbose" = true ]; then
    echo "$long_message"
  fi

  printf "${colour_code}%s${end_code}\n" "$short_message"

}

# Pre-render unit tests
output=$(npm run pre-test 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message "Error: Pre-render unit tests failed" "Error: $output" "red"
  exit $exit_code
fi

print_message "Pre-render unit tests successful" "Output: $output" "blue"

# Create timeline pages
output=$(npm run pre-render 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message "Error: Failed to create timeline pages" "Error: $output" "red"
  exit $exit_code
fi

print_message "Created timeline pages successfully" "Output: $output" "blue"


# Create static site
output=$(quarto render 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message "Error: Failed to create static site with Quarto" "Error: $output" "red"
  exit $exit_code
fi

print_message "Created static site" "Output: $output" "blue"

# Client side unit tests
# TODO


# Post-render unit tests
output=$(npm run post-test 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  print_message "Error: Post-render unit tests failed" "Error: $output" "red"
  exit $exit_code
fi

print_message "Post-render unit tests successful" "Output: $output" "blue"

print_message "All tasks completed successfully" "" "blue"
