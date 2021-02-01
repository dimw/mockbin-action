# Mockbin Action

_Mockbin Action_ is a GitHub Action which provides a framework for 
[mocking](https://en.wikipedia.org/wiki/Mock_object) and validating calls to executables/binaries. 
It can be used for unit testing of [custom GitHub Actions](https://docs.github.com/en/actions/creating-actions)
and thus helps developing more reliable code. 

## Inputs

### `commands`

**Required** Command or (newline separated) list of commands to mock.

### `assert-call-index`

Assert for call (starting) with the given index.

### `assert-args`

Assert for calls (newline separated) with given arguments. Parameters must be in the JSON array format.

<!-- 
### `assert-stdin`

(Planned) Assert piped stdin.
--->

## Outputs

None.

## Example Usage

### Test Object

Assuming, we are creating a [new custom GitHub Action](https://docs.github.com/en/actions/creating-actions).
Our action should perform a set of calls on specific executables (like `kubectl`), e.g.:

```yaml
name: "Kubectl Apply Action"
runs:
  using: "composite"
  steps:
    - run: |
        kubectl apply -f deployment.yaml
        kubectl get deployments
      shell: bash
```

### Test Setup

Now, we would like to unit test our custom action without calling the real `kubectl`.
_Mockbin Action_ can be used for creating a mock for that (see _Arrange_ step).
       
From this time on, for the current job, a mocked version of the `kubectl` will be used whenever the command 
is called. This also applies to the following _Act_ step where our custom action is used.

Finally, we would like to check whether our action called `kubectl` properly. Therefore, we can define a list
of expected arguments in the order of precedence (see _Assert_ step).

The entire test workflow could look as following: 

```yaml
name: Test action
on:
  push:
jobs:
  should-mock-binary-and-assert:
    name: Test action
    runs-on: ubuntu-latest
    steps:
      - name: "Arrange - Create mock for "kubectl" commands"
        uses: "dimw/mockbin-action@main"
        with:
          commands: kubectl
      
      - name: "Act - Action call"
        uses: "./"  # for locally located action
        # uses: "examples/kubectl-apply-action@main" # for remotely located action
    
      - name: "Assert - Verify whether calls were made"
        uses: "dimw/mockbin-action@main"
        with:
          commands: kubectl
          assert-args: |
            ["apply", "-f", "deployment.yaml"]
            ["get", "deployments"]
```

By putting it in the action's `.github/workflows/` folder we can ensure that the check will be performed 
whenever the action has changed. This will also allow us catching bugs and avoid regression issues in the 
consumers of our action. 

Please refer to the [workflow folder](./github/workflows/) for a more complex usage examples of the _Mockbin Action_.
