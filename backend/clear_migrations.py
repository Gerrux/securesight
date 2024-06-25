import os
import time


def clear_migrations(path):
    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        if os.path.isfile(file_path) and filename != "__init__.py":
            os.remove(file_path)


if __name__ == "__main__":
    clear_migrations(os.path.abspath("./videoanalytics/migrations"))
    time.sleep(3)
