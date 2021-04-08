#!/usr/bin/env bash

# shellcheck disable=SC2034
MOCKBIN_PATH="./test"
MOCKBIN_ORIGINAL_NODEJS="node"
GITHUB_ACTION_PATH=$(pwd)

source lib/perform_assert.sh

perform_assert "example" "0" "[\"abc\", \"--def\"]"
perform_assert "example" "0" "[\"^abc$\", \"^--def$\"]"
perform_assert "example" "0" "[\"abc\", \"--def\", \"xx\"]"
perform_assert "example" "1" "[\"foo\", \"bar\", \"--regex=[0-9]+\"]"
