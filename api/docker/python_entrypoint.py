import os


def run_tests_on(indiening_id, project_id):
    stream = os.popen(f"bash rundocker.sh {indiening_id} {project_id}")
    output = stream.read()
    return (": FAIL" in output, output)
