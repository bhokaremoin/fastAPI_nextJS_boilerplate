import os


class FileManager:
    @staticmethod
    def read_file(file_path: str):
        exists = os.path.isfile(file_path)
        if not exists:
            file_path = "app/" + file_path
        exists = os.path.isfile(file_path)
        if not exists:
            raise Exception("File not found: " + file_path)
        with open(file_path, 'r') as file:
            file_content = file.read()
        return file_content
