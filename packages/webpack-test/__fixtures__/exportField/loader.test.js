/**
 * @jest-environment node
 */
import run from '../../compiler.js';
import path from 'path'
import readAssets from "../../utils/readAssets";

test('Inserts name and outputs JavaScript', async () => {
    const {stats,compiler} = await run(path.resolve(__dirname,'input.js'));
    // const output = stats.toJson({source: true}).modules[0].source;
    const output = readAssets(compiler, stats)



    expect(Object.keys(output).some((key)=>{
        return output[key].indexOf(`import("js-cookie")`) > -1
    })).toBe(true)

});
