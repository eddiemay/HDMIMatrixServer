local APIServer = require "APIServer"
local APIService = require "GenericService"
local GenericStore = require "GenericStore"
local DAO = require "DAOFileIOImpl"
local resourceServlet = require "ResourceServlet"

local function sendCommand(command)
  uart.setup(0, 9600, 8, uart.PARITY_NONE, uart.STOPBITS_1, 1)
  uart.write(0, command)
  tmr.delay(35)
  uart.write(0, 0xff - command)
  tmr.delay(35)
  uart.write(0, 0xd5)
  tmr.delay(35)
  uart.write(0, 0x7b)
end

local function togglePwr(self, request)
  sendCommand(0x10)
  return {}
end

local dao = DAO:new()
local inputService = APIService:new{store = GenericStore:new{name = "inputs", dao = dao}}
local outputStore = GenericStore:new{name = "outputs", dao = dao}
outputStore.update = function(self, id, updater)
  return self.super.update(self, id, function(current)
    local updated = updater(current)
    if (updated.selected ~= current.selected) then
      sendCommand((updated.id - 1) * 4 + updated.selected - 1)
    end
    return updated
  end)
end
local outputService = APIService:new{store = outputStore}
local server = APIServer:new{resourceServlet = resourceServlet, services =
    {inputs = inputService, outputs = outputService, power = {get = togglePwr, list = togglePwr, toggle = togglePwr}}}
server:start()
