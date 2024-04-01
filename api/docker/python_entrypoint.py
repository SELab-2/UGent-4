import pexpect
from dotenv import dotenv_values


def run_tests_on(indiening_id, project_id):
    command = f"sudo bash api/docker/rundocker.sh {indiening_id} {project_id}"
    child = pexpect.spawn(command, timeout=None)
    index = child.expect([r'\[sudo\] password', pexpect.EOF, pexpect.TIMEOUT])

    dot_env_values = dotenv_values('api/.env')
    if index == 0:
        child.sendline(dot_env_values.get('SUDO_PASSWORD'))
    
    output = child.read().decode('utf-8')
    child.close()
    return ": FAIL" in output, output
