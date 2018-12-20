from django.contrib.staticfiles.templatetags.staticfiles import static
import openpyxl, os

def parser(fname="scenario/L4-M99-S186-107.xlsx"):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    scenario = BASE_DIR + "/static/"+fname
    wb = openpyxl.load_workbook(scenario, read_only=True, data_only=True)
    sheet_ranges = wb['Sheet 1']
    _level = ''
    _process = ''
    lines = ''
    topic_selection = 0
    for idx, row in enumerate(sheet_ranges.rows):
        if idx <5:
            for cell in row:
                if cell.value:
                    continue
        else:
            _type = ''
            _content = ''
            for cell in row:
                if cell.value:
                    if cell.column=="A" or cell.column==1:
                        _level = cell.value
                    elif cell.column=="B" or cell.column==2:
                        _process = cell.value
                        if _process != '주제선택' and topic_selection==0:
                            break
                        else:
                            topic_selection+=1
                    elif cell.column=="C" or cell.column==3:
                        _type = cell.value
                        if _type == "교사":
                            if topic_selection==1:
                                _type=''
                            else:
                                _type= '<bw>'
                        elif _type == "학생":
                            _type = '<uw>'
                        topic_selection+=1
                    elif cell.column=="D" or cell.column==4:
                        _content = cell.value
                        _content = _content.format(name="사용자")
                else:
                    if str(cell) == "<EmptyCell>":
                        continue
                    if (cell.column=="B" or cell.column==2) and topic_selection<2:
                        if _process != '주제선택' and topic_selection==0:
                            break
                        elif _process == '주제선택' or topic_selection<2:
                            topic_selection+=1
                            break
            if _content:
                lines = lines + _type + _content + '\n'
    return (lines.strip())
# parser()