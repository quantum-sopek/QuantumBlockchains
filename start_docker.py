#!/usr/bin/python
import subprocess

subprocess.call("yarn build:multiple-dockers", shell=True)
subprocess.call("yarn start:multiple-dockers", shell=True)
