def convert_to_dict(columns, results):
    """
    This method converts the resultset from postgres to dictionary
    interates the data and maps the columns to the values in result set and converts to dictionary
    :param columns: List - column names return when query is executed
    :param results: List / Tupple - result set from when query is executed
    :return: list of dictionary- mapped with table column name and to its values
    """

    allResults = []
    columns = [col.name for col in columns]
    if type(results) is list:
        for value in results:
            allResults.append(dict(zip(columns, value)))
        return allResults
    elif type(results) is tuple:
        allResults.append(dict(zip(columns, results)))
        return allResults