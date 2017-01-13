#!/usr/bin/env node

require('shelljs/global')

var program = require('commander')

function cleanArtifacts () {
  cd(__dirname)

  rm('-rf', '.build')
}

function clean () {
  cleanArtifacts()

  cd(__dirname)

  rm('-rf', 'dist')
}

function dist () {
  cd(__dirname)

  mkdir('-p', '.build')

  // clone bootstrap repo
  exec('git clone --depth 1 --branch v3-dev git@github.com:twbs/bootstrap.git ' + '.build/original')

  // copy everything to custom
  mkdir('-p', '.build/custom/')
  cp('-r', '.build/original/*', '.build/custom/')

  // apply changes to custom
  cp('-r', 'custom/*', '.build/custom/')

  // build distribution
  cd('.build/custom')
  exec('npm install')
  exec('grunt dist')
  cd('../..')

  // copy distribution
  mkdir('-p', 'dist')
  cp('-r', '.build/custom/dist/*', 'dist/')
  cp('-r', 'custom/dist/*', 'dist/')
}

program
  .command('clean')
  .action(clean)

program
  .command('clean-artifacts')
  .action(cleanArtifacts)

program
  .command('dist')
  .action(dist)

program.parse(process.argv)
