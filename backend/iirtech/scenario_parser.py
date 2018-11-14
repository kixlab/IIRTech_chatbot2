from django.contrib.staticfiles.templatetags.staticfiles import static
import openpyxl

def parser(fname="scenario/L4-M99-S186-107.xlsx"):
    scenario = static(fname)
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
                    print(cell,idx, cell.value)
        else:
            _type = ''
            _content = ''
            for cell in row:
                if cell.value:
                    if cell.column=="A":
                        _level = cell.value
                    elif cell.column=="B":
                        _process = cell.value
                        if _process != '주제선택' and topic_selection==0:
                            print(cell.value)
                            break
                        else:
                            topic_selection+=1
                        # elif _process == '주제선택' or topic_selection<2:
                        #     print(cell.value)
                        #     topic_selection+=1
                        #     break
                    elif cell.column=="C":
                        _type = cell.value
                        # if topic_selection==2 and _type == "교사":
                        #     _type=''
                        # elif topic_selection==3 and _type == "교사":
                        #     _type=''
                        #     lines=''
                        #     topic_selection-=1
                        # elif topic_selection==3 and _type == "학생":
                        #     _type=''
                        if _type == "교사":
                            if topic_selection==1:
                                _type=''
                            else:
                                _type= '<bw>'
                        elif _type == "학생":
                            _type = '<uw>'
                        topic_selection+=1
                    elif cell.column=="D":
                        # if topic_selection==4:
                        #     _content='대화를 시작해봅시다.'
                        # else:
                        _content = cell.value
                        _content = _content.format(name="사용자")
                else:
                    if cell.column=="B" and topic_selection<2:
                        if _process != '주제선택' and topic_selection==0:
                            print(cell.value)
                            break
                        elif _process == '주제선택' or topic_selection<2:
                            print(cell.value)
                            topic_selection+=1
                            break
            if _content:
                lines = lines + _type + _content + '\n'
                print("%s %s %s %s" %(_level, _process, _type, _content))
    print(lines)
    return (lines.strip())
# parser()