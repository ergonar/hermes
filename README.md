# Git Branches

The principal branches are:

- master
  - Final product.
  - Do not merge from anything other than release and hotfix branches.
- develop
  - Used for main line of work.
  - Created from master

The secondary branches are:

- feature
  - Feature to add or expand.
  - Created from develop.
- release
  - Hold candidates for new releases.
  - Only for bug fixing.
  - Created from develop.
- hotfix
  - Solve bugs in main branch.
  - Created from master.
  - Once finished merge to master and develop.
- junk
  - Functionality that is not going to be integrated.

## Naming conventions

1. Use group tokens

```
group1/foo
group1/fuu
group2/foo
groupn/fnn
```

2. Use short lead tokens

```
feat - Feature
junk - Throwaway branch
rel - Release
fix - Hotfix
```

3. Use slashes to separate parts

4. Do not use numbers

5. Avoid long names

Some examples:

```
feat/foo
feat/faa
rel/foo
fix/foo
junk/poc
```
