from mcp.server.fastmcp import FastMCP
from typing import Annotated, List, Dict
import yfinance as yf


mcp = FastMCP(
    name="chatbot-tools",
    host="127.0.0.1",
    port=8080,
    timeout=30,
    debug=True
    )

@mcp.tool()
def get_file_data(
    file_paths: Annotated[List[str], "読み込むファイルパスの配列"],
) -> str:
    """
    配列内のファイルパスを元にファイルを読み込み、ファイルごとの内容を取得する
    """
    files_data = ""
    for file_path in file_paths:
        try:
            # ファイルのタイプを取得
            file_type = file_path.split(".")[-1].lower()
            # ファイルのタイプごとに読み取り方法を分岐
            if file_type ==  "pdf":
                files_data += f"\n<file name='{file_path}'>\n[PDF files are not supported]\n</file>\n\n"
                continue
            else:
                print("start reading a file")
                with open(file_path, "r", encoding="utf-8") as file:
                    content = file.read()
                    files_data += f"\n<file name='{file_path}'>\n{content}\n</file>\n\n"
                print("finished reading a file")
        except FileNotFoundError:
            files_data += f"\n<file name='{file_path}'>\n[File not found]\n</file>\n\n"
        except Exception as e:
            files_data += f"\n<file name='{file_path}'>\n[Error reading file: {str(e)}]\n</file>\n\n"
    return files_data



if __name__ == "__main__":
    mcp.run(transport="stdio")
