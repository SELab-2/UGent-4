import pexpect
from dotenv import dotenv_values


def run_tests_on(indiening_id, project_id):
    """
    Voert tests uit op een specifieke indiening en project met behulp van Docker.

    Args:
        indiening_id (int): Het ID van de indiening.
        project_id (int): Het ID van het project.

    Returns:
        tuple: Een tuple (bool, string) die aangeeft of de tests zijn mislukt en de uitvoer van de tests.
    """
    command = f"sudo bash api/docker/rundocker.sh {indiening_id} {project_id}"
    child = pexpect.spawn(command, timeout=None)
    index = child.expect([r"\[sudo\] password", pexpect.EOF, pexpect.TIMEOUT])

    dot_env_values = dotenv_values("api/.env")
    if index == 0:
        child.sendline(dot_env_values.get("SUDO_PASSWORD"))
    output = child.read().decode("utf-8")
    child.close()
    return ": FAIL" in output, output
