UNCCTutorApp
============

UNCCTutorApp

There is now a new branch to work on the style redesign. 
This branch is called new_style
To checkout this branch run these commands:

```Bash
git checkout new_style
git pull
```

Then from that point on all commits or changes will affect that branch, so make sure you are in the right branch when you are pushing to the repo.

If you want to change back:

```Bash
git checkout master
```

Add [this][gist_git_sh] to your `.bash_profile` or equivalent for your OS to display what branch you have checked out and its status.

[gist_git_sh]:https://gist.github.com/matthew-campbell/5388160


If you want to make a new branch:

```Bash
git checkout -b new_branch
git commit -am "my new branch"
git push origin new_branch
```

Your working directory must be not have any uncommited changes to switch to a new branch, use stash (man git-stash) to save your work and `clean` the working directory.

Then checkout back to master
